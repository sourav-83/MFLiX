// SynopsisSection.jsx
import React from "react";
import { Box, Typography, Container } from "@mui/material";

function SynopsisSection({ synopsis }) {
  return (
    <Box sx={{ backgroundColor: '#121212', py: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h6" gutterBottom sx={{ color: '#f5c518' }}>
          Synopsis
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'white' }}>
          {synopsis}
        </Typography>
      </Container>
    </Box>
  );
}

export default SynopsisSection;