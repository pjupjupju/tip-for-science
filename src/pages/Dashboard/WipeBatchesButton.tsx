import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const WipeBatchesButton = ({ mutation, loading, buttonStyles }) => {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const resetDialogState = () => {
    setConfirmText('');
    setLocalError(null);
    // keep success outside dialog if you want; up to you
  };

  const handleOpen = () => {
    resetDialogState();
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return; // prevent closing while running (optional)
    setOpen(false);
    resetDialogState();
  };

  const handleSubmit = async () => {
    setLocalError(null);

    if (confirmText.trim().toLowerCase() !== 'delete') {
      setLocalError('Please type exactly "delete" to confirm.');
      return;
    }

    try {
      const res = await mutation();
      const ok = res.data?.wipeBatches;

      if (ok) {
        setOpen(false);
        resetDialogState();
      } else {
        setLocalError('Deletion failed (server returned false).');
      }
    } catch {
      // onError already sets message; this is for TS
    }
  };

  const canSubmit = confirmText.trim().toLowerCase() === 'delete' && !loading;

  return (
    <>
      <Button variant="contained" sx={buttonStyles} onClick={handleOpen}>
        {loading ? '... deleting' : 'Delete batches'}
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Confirm deletion</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ mb: 2 }}>
            This will delete all user batches. Type <b>delete</b> to confirm.
          </Typography>

          {localError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {localError}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            label='Type "delete"'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSubmit();
              }
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={() => void handleSubmit()}
            variant="contained"
            color="error"
            disabled={!canSubmit}
            startIcon={loading ? <CircularProgress size={16} /> : undefined}
          >
            {loading ? 'Deleting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export { WipeBatchesButton };