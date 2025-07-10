// CrewSection.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

function CrewSection({ directors, writers, formatDate }) {
  if ((!directors || directors.length === 0) && (!writers || writers.length === 0)) {
    return null;
  }

  return (
    <Grid container spacing={4} mb={5}>
      {/* Directors */}
      {directors && directors.length > 0 && (
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
            Directors
          </Typography>
          {directors.map((director, index) => (
            <Card key={index} sx={{ backgroundColor: 'rgba(40, 40, 40, 0.9)', color: 'white', mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={`/img/${director.image}`}
                    alt={director.name}
                    sx={{ width: 60, height: 60 }}
                  />
                  <Box>
                    <Typography variant="h6">{director.name}</Typography>
                    <Typography variant="body2" color="grey.400">
                      {director.nationality} • Born {formatDate(director.dateofbirth)}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {director.bio}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      )}

      {/* Writers */}
      {writers && writers.length > 0 && (
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
            Writers
          </Typography>
          {writers.map((writer, index) => (
            <Card key={index} sx={{ backgroundColor: 'rgba(40, 40, 40, 0.9)', color: 'white', mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={`/img/${writer.image}`}
                    alt={writer.name}
                    sx={{ width: 60, height: 60 }}
                  />
                  <Box>
                    <Typography variant="h6">{writer.name}</Typography>
                    <Typography variant="body2" color="grey.400">
                      {writer.nationality} • Born {formatDate(writer.dateofbirth)}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {writer.bio}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>
      )}
    </Grid>
  );
}

export default CrewSection;