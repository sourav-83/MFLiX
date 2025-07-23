const express = require("express");

// Module exports a function that takes dependencies (db, authenticateToken)
module.exports = ({ db, authenticateToken }) => {
  const router = express.Router();

  // --- Admin-specific Middleware ---
  // Define authenticateAdmin here, but also make it accessible for export
  const authenticateAdmin = (req, res, next) => {
    // ADDED: Log req.user at the very beginning of the middleware
    console.log(`[authenticateAdmin] req.user:`, req.user);

    // req.user is populated by authenticateToken middleware
    if (!req.user || req.user.userType !== 'admin') {
      console.log(`[authenticateAdmin] Access denied: req.user is missing or userType is not 'admin'. userType: ${req.user ? req.user.userType : 'N/A'}`);
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    // This log should now correctly show the username if server.js generateToken is updated
    console.log(`Admin access granted for user: ${req.user.username}`);
    next();
  };

  // ===================================================================
  // --- ADMIN ROUTES ---
  // All routes in this section require both authentication and admin privileges
  // ===================================================================

  // GET /api/user/admin/top_users - Fetch top users based on activity
  router.get('/top_users', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
      const query = `
        SELECT
            u.UserID AS id,
            u.Username AS username,
            COALESCE(COUNT(DISTINCT wm.MovieID), 0) AS "watchlistCount",
            COALESCE(COUNT(DISTINCT r.ReviewID) FILTER (WHERE r.RatingScore IS NOT NULL), 0) AS "ratingCount",
            COALESCE(COUNT(DISTINCT r.ReviewID) FILTER (WHERE r.Content IS NOT NULL), 0) AS "reviewCount",
            COALESCE(SUM(r.Upvotes + r.Downvotes), 0) AS "reactionCount"
        FROM
            Users u
        LEFT JOIN
            Watchlists w ON u.UserID = w.UserID
        LEFT JOIN
            WatchlistMovies wm ON w.WatchlistID = wm.WatchlistID
        LEFT JOIN
            Reviews r ON u.UserID = r.UserID
        GROUP BY
            u.UserID, u.Username
        ORDER BY
            "reviewCount" DESC, "ratingCount" DESC, "watchlistCount" DESC
        LIMIT 20; -- Limit to top 20 users
      `;
      const result = await db.query(query);
      console.log('Top users fetched:', result.rows.length);

      res.json({ users: result.rows });
    } catch (error) {
      console.error('Error fetching top users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // GET /api/user/admin/reports - Fetch reported reviews
  router.get('/reports', authenticateToken, authenticateAdmin, async (req, res) => {
    try {
      const query = `
        SELECT
            rr.ReportID AS id,
            u_commenter.Username AS "commenterUsername",
            u_reporter.Username AS "reporterUsername",
            r.Content AS "reviewContent",
            rr.ReportReason AS "reportReason",
            rr.ReportedAt AS "reportDate",
            r.ReviewID AS "reviewId", -- Include reviewId for actions
            u_commenter.UserID AS "commenterUserId" -- Include commenter's UserID for banning
        FROM
            ReviewReports rr
        JOIN
            Reviews r ON rr.ReviewID = r.ReviewID
        JOIN
            Users u_commenter ON r.UserID = u_commenter.UserID
        LEFT JOIN -- Use LEFT JOIN in case reporter user is deleted (ReporterUserID ON DELETE SET NULL)
            Users u_reporter ON rr.ReporterUserID = u_reporter.UserID
        WHERE
            rr.IsResolved = FALSE -- Only fetch unresolved reports
        ORDER BY
            rr.ReportedAt DESC;
      `;
      const result = await db.query(query);

      res.json({ reports: result.rows });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // POST /api/user/admin/ignore_report - Ignore a report (mark as resolved)
  router.post('/ignore_report', authenticateToken, authenticateAdmin, async (req, res) => {
    const { reportId } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: 'Report ID is required' });
    }

    try {
      const result = await db.query(
        `UPDATE ReviewReports
         SET IsResolved = TRUE
         WHERE ReportID = $1
         RETURNING ReportID;`,
        [reportId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }

      res.json({ success: true, message: 'Report ignored successfully' });
    } catch (error) {
      console.error('Error ignoring report:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // POST /api/user/admin/delete_comment - Delete a comment (review)
  router.post('/delete_comment', authenticateToken, authenticateAdmin, async (req, res) => {
    const { reportId: reportIdRaw } = req.body;
    console.log(`[Delete Comment] Received request to delete reportId: ${reportIdRaw}`);

    if (!reportIdRaw) {
      console.log('[Delete Comment] Error: Report ID not provided.');
      return res.status(400).json({ message: 'Report ID is required' });
    }

    let reportId;
    try {
      reportId = parseInt(reportIdRaw, 10);
      if (isNaN(reportId)) {
        console.log(`[Delete Comment] Error: Invalid Report ID format: ${reportIdRaw}`);
        throw new Error("Invalid Report ID format");
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    console.log(`[Delete Comment] Attempting to find review for parsed Report ID: ${reportId}`);

    let reviewId;
    try {
      const reportResult = await db.query(
        `SELECT ReviewID FROM ReviewReports WHERE ReportID = $1;`,
        [reportId]
      );

      if (reportResult.rowCount === 0) {
        console.log(`[Delete Comment] No report found with ID ${reportId}.`);
        return res.status(404).json({ message: 'Report not found' });
      }

      reviewId = reportResult.rows[0].reviewid;
      console.log(`[Delete Comment] Found ReviewID ${reviewId} for ReportID ${reportId}. Proceeding to delete review.`);

      const deleteReviewResult = await db.query(
        `DELETE FROM Reviews
         WHERE ReviewID = $1
         RETURNING ReviewID;`,
        [reviewId]
      );

      if (deleteReviewResult.rowCount === 0) {
        console.log(`[Delete Comment] Review with ID ${reviewId} not found or already deleted.`);
        return res.status(404).json({ message: 'Review not found or already deleted' });
      }

      console.log(`[Delete Comment] Successfully deleted review with ID: ${reviewId} (from ReportID: ${reportId}).`);
      res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('[Delete Comment] Error processing request:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // POST /api/user/admin/delete_and_ban - Delete a comment and Ban a user
  router.post('/delete_and_ban', authenticateToken, authenticateAdmin, async (req, res) => {
    const { reportId: reportIdRaw, username } = req.body;
    console.log(`[Delete & Ban] Received request for reportId: ${reportIdRaw}, username: ${username}`);

    if (!reportIdRaw || !username) {
      return res.status(400).json({ message: 'Report ID and Username are required' });
    }

    let reportId;
    try {
      reportId = parseInt(reportIdRaw, 10);
      if (isNaN(reportId)) {
        console.log(`[Delete & Ban] Error: Invalid Report ID format: ${reportIdRaw}`);
        throw new Error("Invalid Report ID format");
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    let reviewDeleted = false;
    let userBanned = false;
    let bannedUsername = null;
    let banUntil = null;
    let reviewId = null;

    try {
      // --- Step 1: Delete the Comment (Review) ---
      console.log(`[Delete & Ban] Attempting to find review for Report ID: ${reportId}`);
      const reportResult = await db.query(
        `SELECT ReviewID FROM ReviewReports WHERE ReportID = $1;`,
        [reportId]
      );

      if (reportResult.rowCount > 0) {
        reviewId = reportResult.rows[0].reviewid;
        console.log(`[Delete & Ban] Found ReviewID ${reviewId} for ReportID ${reportId}.`);

        const deleteReviewResult = await db.query(
          `DELETE FROM Reviews
           WHERE ReviewID = $1
           RETURNING ReviewID;`,
          [reviewId]
        );

        if (deleteReviewResult.rowCount > 0) {
          reviewDeleted = true;
          console.log(`[Delete & Ban] Successfully deleted review with ID: ${reviewId}.`);
        } else {
          console.log(`[Delete & Ban] Review with ID ${reviewId} not found or already deleted.`);
          // Continue to ban user even if review was already gone
        }
      } else {
        console.log(`[Delete & Ban] No report found with ID ${reportId}. Cannot delete review.`);
        // Continue to ban user even if report was not found
      }

      // --- Step 2: Ban the User ---
      console.log(`[Delete & Ban] Attempting to ban user: ${username}`);
      const banUntilDate = new Date();
      banUntilDate.setDate(banUntilDate.getDate() + 30); // Ban for 30 days

      const banResult = await db.query(
        `UPDATE Users
         SET IsBanned = TRUE, BanUntil = $1
         WHERE Username = $2
         RETURNING UserID, Username, IsBanned, BanUntil;`,
        [banUntilDate, username]
      );

      if (banResult.rowCount > 0) {
        userBanned = true;
        bannedUsername = banResult.rows[0].username;
        banUntil = banResult.rows[0].banuntil;
        console.log(`[Delete & Ban] User ${bannedUsername} banned until ${banUntil.toDateString()}.`);
      } else {
        console.log(`[Delete & Ban] User with username ${username} not found. Cannot ban.`);
      }

      // --- Final Response ---
      let message = [];
      if (reviewDeleted) {
        message.push(`Comment (Review ID: ${reviewId}) deleted successfully.`);
      } else if (reviewId) { // If reviewId was found but not deleted (e.g., already gone)
        message.push(`Comment (Review ID: ${reviewId}) was already deleted.`);
      } else {
        message.push(`No comment found for report ID ${reportId}.`);
      }

      if (userBanned) {
        message.push(`User ${bannedUsername} banned until ${banUntil.toDateString()}.`);
      } else {
        message.push(`User ${username} not found or could not be banned.`);
      }

      res.json({
        success: reviewDeleted || userBanned, // Success if at least one action happened
        message: message.join(" "),
        reviewDeleted: reviewDeleted,
        userBanned: userBanned,
        bannedUser: userBanned ? { username: bannedUsername, banUntil: banUntil } : null,
      });

    } catch (error) {
      console.error('[Delete & Ban] Error processing request:', error);
      res.status(500).json({ message: 'Internal server error', details: error.message });
    }
  });

  // Export authenticateAdmin so it can be used by other modules
  return { router, authenticateAdmin };
};
