'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Gold
      light: '#FFE44D',
      dark: '#B3A600',
      contrastText: '#000000',
    },
    secondary: {
      main: '#FFD700', // Gold
      light: '#FFE44D',
      dark: '#B3A600',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: 'rgba(18, 18, 18, 0.8)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#FFD700',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#FFD700',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#FFD700',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#FFD700',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#FFD700',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#FFD700',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          background: 'rgba(255, 215, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          '&:hover': {
            background: 'rgba(255, 215, 0, 0.2)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          },
        },
        contained: {
          background: '#FFD700',
          color: '#000000',
          '&:hover': {
            background: '#FFE44D',
          },
        },
        outlined: {
          borderColor: '#FFD700',
          color: '#FFD700',
          '&:hover': {
            borderColor: '#FFE44D',
            color: '#FFE44D',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
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
            color: '#FFFFFF',
            '& input': {
              color: '#FFFFFF',
            },
            '& textarea': {
              color: '#FFFFFF',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-focused': {
                color: '#FFD700',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 215, 0, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 215, 0, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FFD700',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&.Mui-focused': {
            color: '#FFD700',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: 'rgba(255, 215, 0, 0.3)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#FFD700',
          },
          color: '#FFFFFF',
          '& input': {
            color: '#FFFFFF',
          },
          '& textarea': {
            color: '#FFFFFF',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 215, 0, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFD700',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(18, 18, 18, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 215, 0, 0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 215, 0, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFD700',
          },
          color: '#FFFFFF',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          '&:hover': {
            background: 'rgba(255, 215, 0, 0.1)',
          },
          '&.Mui-selected': {
            background: 'rgba(255, 215, 0, 0.2)',
            color: '#FFD700',
            '&:hover': {
              background: 'rgba(255, 215, 0, 0.3)',
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
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
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 215, 0, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 215, 0, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FFD700',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(18, 18, 18, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 215, 0, 0.1)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(255, 215, 0, 0.1)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#FFD700',
          '&:hover': {
            background: 'rgba(255, 215, 0, 0.1)',
          },
        },
      },
    },
  },
}); 