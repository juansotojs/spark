import React, { useState } from 'react';
import { Button, Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface WalletBalance {
  currency: string;
  balance: string;
  usdValue: number;
}

export default function CryptoWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [balances, setBalances] = useState<WalletBalance[]>([]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        
        // Get ETH balance
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        
        // Convert balance from wei to ETH
        const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
        
        setBalances([
          {
            currency: 'ETH',
            balance: ethBalance.toFixed(4),
            usdValue: 0 // TODO: Implement price fetching
          }
        ]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Crypto Wallet
      </Typography>
      {!isConnected ? (
        <Button
          variant="contained"
          startIcon={<AccountBalanceWalletIcon />}
          onClick={connectWallet}
          fullWidth
        >
          Connect Wallet
        </Button>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Your Balances
          </Typography>
          <List>
            {balances.map((balance) => (
              <ListItem key={balance.currency}>
                <ListItemText
                  primary={`${balance.currency}: ${balance.balance}`}
                  secondary={`USD Value: $${balance.usdValue.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
} 