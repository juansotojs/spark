'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Tab, Tabs, Paper, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExpenseLogger from './components/ExpenseLogger';
import AiFeedback from './components/AiFeedback';
import { MonthlyDashboard } from './components/MonthlyDashboard';
import VoiceInput from './components/VoiceInput';
import CryptoWallet from './components/CryptoWallet';
import { ExpenseLogs } from './components/ExpenseLogs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/expenses/summary');
        if (!response.ok) throw new Error('Failed to fetch summary');
        const data = await response.json();
        setExpenseSummary(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          mb: 4,
          p: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
            },
          }}
        >
          <Tab
            icon={<DashboardIcon />}
            label="Dashboard"
            iconPosition="start"
          />
          <Tab
            icon={<AddCircleOutlineIcon />}
            label="Log Expense"
            iconPosition="start"
          />
          <Tab
            icon={<AccountBalanceWalletIcon />}
            label="Crypto"
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ mb: 4 }}>
              <MonthlyDashboard summary={expenseSummary} loading={loading} />
            </Box>
            <AiFeedback expense={{
              amount: 0,
              description: '',
              category: '',
              date: new Date().toISOString().split('T')[0]
            }} />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <ExpenseLogger />
            <Box sx={{ mt: 4 }}>
              <ExpenseLogs />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ 
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
                  Coming Soon
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Wallet integration and portfolio tracking coming to Spark soon!
                </Typography>
              </Box>
            </Box>
            <CryptoWallet />
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}
