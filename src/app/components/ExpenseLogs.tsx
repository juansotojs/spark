import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

interface Expense {
  id: string;
  amount: number;
  category: string;
  createdAt: string;
}

export function ExpenseLogs() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    category: '',
  });
  const theme = useTheme();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setEditForm({
      amount: expense.amount.toString(),
      category: expense.category,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedExpense) return;

    try {
      const response = await fetch(`/api/expenses/${selectedExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(editForm.amount),
          category: editForm.category,
        }),
      });

      if (!response.ok) throw new Error('Failed to update expense');

      await fetchExpenses();
      setEditDialogOpen(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;

    try {
      const response = await fetch(`/api/expenses/${selectedExpense.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete expense');

      await fetchExpenses();
      setDeleteDialogOpen(false);
      setSelectedExpense(null);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
        Expense Logs
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell align="right">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleEditClick(expense)}
                    sx={{ color: theme.palette.primary.main }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(expense)}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              label="Category"
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle>Delete Expense</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this expense? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              bgcolor: theme.palette.error.main,
              '&:hover': {
                bgcolor: theme.palette.error.dark,
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 