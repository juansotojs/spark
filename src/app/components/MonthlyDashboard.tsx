import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Box, LinearProgress, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ExpenseSummary {
  totalSpent: number;
  categoryBreakdown: Record<string, number>;
  monthlyChange: number;
  topCategories: string[];
}

export default function MonthlyDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<ExpenseSummary>({
    totalSpent: 0,
    categoryBreakdown: {},
    monthlyChange: 0,
    topCategories: []
  });

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/expenses/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch expense summary');
        }
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [session, router]);

  const getProgressColor = (index: number) => {
    const colors = ['primary.main', 'secondary.main', '#4caf50', '#ff5722', '#9c27b0'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Monthly Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ flexGrow: 1 }}>
                Total Spent
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: summary.monthlyChange < 0 ? 'success.main' : 'error.main' 
                }}
              >
                {summary.monthlyChange < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {Math.abs(summary.monthlyChange).toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="h3" sx={{ mb: 1, color: 'primary.main' }}>
              ${summary.totalSpent.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs. last month
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Spending Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              {summary.topCategories.map((category, index) => (
                <Box key={category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{category}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${summary.categoryBreakdown[category].toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(summary.categoryBreakdown[category] / summary.totalSpent) * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'grey.100',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getProgressColor(index),
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 