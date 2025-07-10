// TrailerDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";

function TrailerDialog({ open, onClose, selectedTrailer }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'black',
          minHeight: '60vh'
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }
          }}
        >
          <Close />
        </IconButton>
        
        {selectedTrailer && (
          <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${selectedTrailer.url}?autoplay=1`}
              title={selectedTrailer.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TrailerDialog;