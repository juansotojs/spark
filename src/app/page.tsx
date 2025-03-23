'use client';

import React from 'react';
import { Container, Box, Tab, Tabs, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExpenseLogger from './components/ExpenseLogger';
import AiFeedback from './components/AiFeedback';
import MonthlyDashboard from './components/MonthlyDashboard';
import VoiceInput from './components/VoiceInput';
import CryptoWallet from './components/CryptoWallet';

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
  const [activeTab, setActiveTab] = React.useState(0);

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
          mb: 4
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
            <MonthlyDashboard />
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
            <VoiceInput />
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <CryptoWallet />
        </TabPanel>
      </Paper>
    </Container>
  );
}
