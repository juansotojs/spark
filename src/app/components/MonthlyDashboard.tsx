'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  useTheme,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface ExpenseSummary {
  totalSpent: number;
  categoryBreakdown: Record<string, number>;
  monthlyChange: number;
  topCategories: Array<{ category: string; amount: number }>;
}

interface MonthlyDashboardProps {
  summary: ExpenseSummary | null;
  loading: boolean;
}

export function MonthlyDashboard({ summary, loading }: MonthlyDashboardProps) {
  const theme = useTheme();

  // Sample insights - in a real app, these would come from your AI service
  const insights: string[] = [
    "Your spending on dining out has increased by 25% this month. Consider setting a budget to maintain your financial goals.",
    "You're saving more on utilities compared to last month. Great job on being energy-efficient!",
    "Your entertainment expenses are below average. This could be a good time to invest in your hobbies or personal development.",
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!summary) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No data available</Typography>
      </Paper>
    );
  }

  // Transform category breakdown into bar chart data
  const barData = Object.entries(summary.categoryBreakdown || {})
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / summary.totalSpent) * 100
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              Total Spent
            </Typography>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 600 }}>
              ${summary.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              Monthly Change
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {summary.monthlyChange >= 0 ? (
                <TrendingUpIcon sx={{ color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main' }} />
              )}
              <Typography
                variant="h4"
                sx={{
                  color: summary.monthlyChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {Math.abs(summary.monthlyChange)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              Top Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {barData.map((item, index) => (
                <Box key={item.category}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.category}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 4,
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* AI Advisor Marketing Section */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
        borderRadius: 2,
        border: '1px solid rgba(255, 215, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: 'primary.main',
          fontSize: '2rem',
        }}>
          ⚡
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600, mb: 0.5 }}>
            Chat with Spark
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your very own AI-powered financial advisor, available on the Omi app today!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 