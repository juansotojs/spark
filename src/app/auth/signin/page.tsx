'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
} from '@mui/material';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email.toLowerCase(),
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            background: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.1)',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ color: '#FFD700' }}
          >
            Sign In
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 215, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFD700',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD700',
                  },
                  color: '#FFFFFF',
                  '& input': {
                    color: '#FFFFFF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#FFD700',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 215, 0, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFD700',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD700',
                  },
                  color: '#FFFFFF',
                  '& input': {
                    color: '#FFFFFF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#FFD700',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                background: '#FFD700',
                color: '#000000',
                '&:hover': {
                  background: '#FFE44D',
                },
              }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link 
              href="/auth/signup" 
              variant="body2"
              sx={{ 
                color: '#FFD700',
                '&:hover': {
                  color: '#FFE44D',
                },
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 