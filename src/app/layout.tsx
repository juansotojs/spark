'use client';

import { AppBar, Box, CssBaseline, ThemeProvider, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Inter } from 'next/font/google';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import theme from './theme';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

function Header() {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
    handleClose();
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 600 }}>
          FinFriend
        </Typography>
        {session ? (
          <div>
            <Button
              onClick={handleMenu}
              startIcon={<AccountCircleIcon />}
              sx={{ color: 'text.primary' }}
            >
              {session.user?.name || session.user?.email}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button color="primary" href="/auth/signin">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, backgroundColor: '#f5f5f5' }}>
        <Providers>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
