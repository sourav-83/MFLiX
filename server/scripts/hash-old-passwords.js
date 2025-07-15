require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../db"); // adjust path if needed

async function hashOldPasswords() {
  const result = await db.query("SELECT userid, passwordhash FROM users");
  for (const user of result.rows) {
    const current = user.passwordhash;

    // Detect if it's already hashed (starts with $2b$)
    if (!current.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(current, 10);
      await db.query("UPDATE users SET passwordhash = $1 WHERE userid = $2", [
        hashed,
        user.userid,
      ]);
      console.log(`Updated user ${user.userid}`);
    }
  }

  console.log("Password hashing complete.");
  process.exit();
}

hashOldPasswords().catch((err) => {
  console.error("Error:", err);
});
