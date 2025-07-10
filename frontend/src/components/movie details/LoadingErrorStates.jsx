// LoadingErrorStates.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

export const LoadingState = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <Typography variant="h5" color="white">Loading...</Typography>
  </Box>
);

export const ErrorState = ({ error }) => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <Typography variant="h5" color="error">{error}</Typography>
  </Box>
);

export const NotFoundState = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <Typography variant="h5" color="white">Movie not found</Typography>
  </Box>
);