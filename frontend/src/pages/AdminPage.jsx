// AdminPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import ReportIcon from '@mui/icons-material/Report';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import IgnoreIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';
import url from '../constants/url';
import { useAuth } from '../components/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const SectionPaper = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled(Typography)`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatsCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 8px;
`;

const ActionButton = styled(Button)`
  margin: 0 4px;
  font-size: 12px;
  padding: 4px 8px;
  min-width: auto;
`;

const ReportCard = styled(Paper)`
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid #f44336;
  background-color: #fafafa;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #666;
`;

const AdminPage = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '',
    reportId: null,
    username: ''
  });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    fetchTopUsers();
    fetchReports();
  }, [isAuthenticated, navigate]);

  const fetchTopUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await axios.get(`${url}/api/user/admin/top_users`);
      setTopUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching top users:', error);
      setTopUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const response = await axios.get(`${url}/api/user/admin/reports`);
      setReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleIgnoreReport = async (reportId) => {
    try {
      setActionLoading(reportId);
      await axios.post(`${url}/api/user/admin/ignore_report`, { reportId });
      
      // Remove the report from the list
      setReports(reports.filter(report => report.id !== reportId));
      setSuccess('Report ignored successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error ignoring report:', error);
      setError('Failed to ignore report');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteComment = async (reportId) => {
    try {
      setActionLoading(reportId);
      await axios.post(`${url}/api/user/admin/delete_comment`, { reportId });
      
      // Remove the report from the list
      setReports(reports.filter(report => report.id !== reportId));
      setSuccess('Comment deleted successfully');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanUser = async (reportId, username) => {
    try {
      setActionLoading(reportId);
      await axios.post(`${url}/api/user/admin/ban_user`, { 
        reportId, 
        username,
        banDuration: 30 // 30 days
      });
      
      // Remove the report from the list
      setReports(reports.filter(report => report.id !== reportId));
      setSuccess(`User ${username} banned for 30 days`);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error banning user:', error);
      setError('Failed to ban user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading(null);
      setConfirmDialog({ open: false, action: '', reportId: null, username: '' });
    }
  };

  const openConfirmDialog = (action, reportId, username) => {
    setConfirmDialog({
      open: true,
      action,
      reportId,
      username
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, action: '', reportId: null, username: '' });
  };

  const handleConfirmAction = () => {
    const { action, reportId, username } = confirmDialog;
    
    switch (action) {
      case 'ignore':
        handleIgnoreReport(reportId);
        break;
      case 'delete':
        handleDeleteComment(reportId);
        break;
      case 'ban':
        handleBanUser(reportId, username);
        break;
      default:
        break;
    }
    
    closeConfirmDialog();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <StyledContainer maxWidth="lg">
      {/* <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
        Admin Dashboard
      </Typography> */}

      {/* Success/Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Top Users Section */}
      <SectionPaper>
        <SectionTitle>
          <PersonIcon />
          Top Users
        </SectionTitle>
        
        {loadingUsers ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : topUsers.length === 0 ? (
          <EmptyState>
            <PersonIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No user data available
            </Typography>
          </EmptyState>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <BookmarkIcon sx={{ mr: 1, fontSize: 16 }} />
                      <strong>Watchlist</strong>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <StarIcon sx={{ mr: 1, fontSize: 16 }} />
                      <strong>Ratings</strong>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <RateReviewIcon sx={{ mr: 1, fontSize: 16 }} />
                      <strong>Reviews</strong>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <ThumbUpIcon sx={{ mr: 1, fontSize: 16 }} />
                      <strong>Reactions</strong>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topUsers.map((user, index) => (
                  <TableRow key={user.id || index} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Chip 
                          label={`#${index + 1}`} 
                          size="small" 
                          color="primary" 
                          sx={{ mr: 2 }}
                        />
                        <strong>{user.username}</strong>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.watchlistCount || 0} 
                        color="info" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.ratingCount || 0} 
                        color="warning" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.reviewCount || 0} 
                        color="success" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.reactionCount || 0} 
                        color="secondary" 
                        variant="outlined" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </SectionPaper>

      {/* Reports Section */}
      <SectionPaper>
        <SectionTitle>
          <ReportIcon />
          Reported Reviews
        </SectionTitle>
        
        {loadingReports ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : reports.length === 0 ? (
          <EmptyState>
            <ReportIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No reports available
            </Typography>
          </EmptyState>
        ) : (
          <Grid container spacing={2}>
            {reports.map((report) => (
              <Grid item xs={12} key={report.id}>
                <ReportCard>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography variant="h6" gutterBottom>
                        Review by: <strong>{report.commenterUsername}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Reported by: <strong>{report.reporterUsername}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Report Date: {formatDate(report.reportDate || new Date())}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1" sx={{ 
                        backgroundColor: '#fff', 
                        padding: 2, 
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}>
                        {report.reviewContent}
                      </Typography>
                      {report.reportReason && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Reason: {report.reportReason}
                        </Typography>
                      )}
                    </Box>
                    
                    <Box display="flex" flexDirection="column" gap={1} ml={2}>
                      <ActionButton
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<IgnoreIcon />}
                        onClick={() => openConfirmDialog('ignore', report.id, report.commenterUsername)}
                        disabled={actionLoading === report.id}
                      >
                        {actionLoading === report.id ? <CircularProgress size={16} /> : 'Ignore'}
                      </ActionButton>
                      
                      <ActionButton
                        variant="contained"
                        color="warning"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => openConfirmDialog('delete', report.id, report.commenterUsername)}
                        disabled={actionLoading === report.id}
                      >
                        Delete Comment
                      </ActionButton>
                      
                      <ActionButton
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<BlockIcon />}
                        onClick={() => openConfirmDialog('ban', report.id, report.commenterUsername)}
                        disabled={actionLoading === report.id}
                      >
                        Ban User (30d)
                      </ActionButton>
                    </Box>
                  </Box>
                </ReportCard>
              </Grid>
            ))}
          </Grid>
        )}
      </SectionPaper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.action === 'ignore' && 
              'Are you sure you want to ignore this report? This action cannot be undone.'}
            {confirmDialog.action === 'delete' && 
              'Are you sure you want to delete this comment? This action cannot be undone.'}
            {confirmDialog.action === 'ban' && 
              `Are you sure you want to ban user "${confirmDialog.username}" for 30 days? This will prevent them from posting reviews and comments.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            color={confirmDialog.action === 'ban' ? 'error' : 'primary'}
            variant="contained"
          >
            {confirmDialog.action === 'ignore' && 'Ignore Report'}
            {confirmDialog.action === 'delete' && 'Delete Comment'}
            {confirmDialog.action === 'ban' && 'Ban User'}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AdminPage;