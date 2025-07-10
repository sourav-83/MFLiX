// NotificationSnackbar.jsx
import React from "react";
import { Snackbar, Alert } from "@mui/material";

function NotificationSnackbar({ open, message, onClose }) {
  const severity = message && (message.includes('Error') || message.includes('Failed') || message.includes('Please log in')) 
    ? 'error' 
    : 'success';

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default NotificationSnackbar;