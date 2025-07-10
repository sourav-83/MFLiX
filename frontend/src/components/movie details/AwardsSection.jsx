// AwardsSection.jsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  styled,
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";

const AwardCard = styled(Card)`
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: white;
  height: 100%;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.5);
  }
`;

function AwardsSection({ awards }) {
  const getAwardCategoryColor = (category) => {
    const categoryColors = {
      'Best Picture': '#ffd700',
      'Best Director': '#ff6b35',
      'Best Actor': '#4ecdc4',
      'Best Actress': '#e056fd',
      'Best Supporting Actor': '#45b7d1',
      'Best Supporting Actress': '#f9ca24',
      'Best Screenplay': '#6c5ce7',
      'Best Cinematography': '#a29bfe',
      'Best Original Score': '#fd79a8',
      'Best Visual Effects': '#00cec9',
      default: '#ddd'
    };
    return categoryColors[category] || categoryColors.default;
  };

  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <Box mb={5}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
        <EmojiEvents sx={{ mr: 2, color: '#ffd700', verticalAlign: 'middle' }} />
        Awards & Recognition
      </Typography>
      <Grid container spacing={3}>
        {awards.map((award, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <AwardCard>
              <CardContent>
                <Box display="flex" alignItems="flex-start" gap={2} mb={2}>
                  <EmojiEvents 
                    sx={{ 
                      color: getAwardCategoryColor(award.Category),
                      fontSize: 30,
                      mt: 0.5
                    }} 
                  />
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#ffd700' }}>
                      {award.Name}
                    </Typography>
                    <Chip
                      label={award.Category}
                      size="small"
                      sx={{
                        backgroundColor: getAwardCategoryColor(award.Category),
                        color: 'black',
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    />
                  </Box>
                </Box>
                
                <Box mb={2}>
                  <Typography variant="body2" color="grey.300" gutterBottom>
                    <strong>Year:</strong> {award.Year}
                  </Typography>
                  {award.RecipientName && (
                    <Typography variant="body2" color="grey.300">
                      <strong>Recipient:</strong> {award.RecipientName}
                    </Typography>
                  )}
                  <Typography variant="body2" color="grey.400" sx={{ mt: 1 }}>
                    <strong>Type:</strong> {award.RecipientType.charAt(0).toUpperCase() + award.RecipientType.slice(1)} Award
                  </Typography>
                </Box>
              </CardContent>
            </AwardCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default AwardsSection;