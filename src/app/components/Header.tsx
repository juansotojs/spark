'use client';

import { Box, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export function Header() {
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
    <Box component="header" sx={{ 
      width: '100%',
      background: 'rgba(18, 18, 18, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Toolbar>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: 'primary.main', 
            fontWeight: 600,
            textTransform: 'lowercase',
            letterSpacing: '0.05em'
          }}
        >
          spark
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
    </Box>
  );
} 