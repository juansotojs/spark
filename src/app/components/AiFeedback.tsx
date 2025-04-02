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
      suggestion: `Based on your ${expense.category} expense of $${expense.amount} in this category, 
        consider setting a monthly budget for investing.`,
      insight: 'Consider investing in smaller cap tokens such as HBAR or XRP.',
      recommendation: 'Investments can bring income up to 100% in a month.'
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