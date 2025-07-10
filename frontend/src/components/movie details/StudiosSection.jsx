// StudiosSection.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";

function StudiosSection({ studios }) {
  if (!studios || studios.length === 0) {
    return null;
  }

  return (
    <Box mb={5}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
        Production Studios
      </Typography>
      <Grid container spacing={3}>
        {studios.map((studio, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: 'rgba(40, 40, 40, 0.9)', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar
                    src={`/img/${studio.logo}`}
                    alt={studio.name}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Box>
                    <Typography variant="h6">{studio.name}</Typography>
                    <Typography variant="body2" color="grey.400">
                      Founded {studio.foundedyear}
                    </Typography>
                  </Box>
                </Box>
                {studio.website && (
                  <Button
                    variant="outlined"
                    size="small"
                    href={studio.website}
                    target="_blank"
                    sx={{ color: 'white', borderColor: 'white' }}
                  >
                    Visit Website
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default StudiosSection;