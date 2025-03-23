import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface AiFeedbackProps {
  expense: {
    amount: number;
    description: string;
    category: string;
    date: string;
  };
}

export default function AiFeedback({ expense }: AiFeedbackProps) {
  // This is a placeholder for the actual AI feedback logic
  const generateFeedback = () => {
    return {
      suggestion: `Based on your ${expense.category} expense of $${expense.amount}, 
        consider setting a monthly budget for this category.`,
      insight: 'This is higher than your usual spending in this category.',
      recommendation: 'Try to reduce similar expenses by 15% next month.'
    };
  };

  const feedback = generateFeedback();

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', my: 2 }}>
      <Typography variant="h6" gutterBottom>
        AI Insights
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body1">
          {feedback.suggestion}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {feedback.insight}
        </Typography>
        <Typography variant="body2" color="primary">
          {feedback.recommendation}
        </Typography>
      </Box>
    </Paper>
  );
} 