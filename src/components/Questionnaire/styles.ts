import { grey } from '@mui/material/colors';

export const mediumBMargin = { mb: 2 };
export const mediumBPadding = { pb: 2 };
export const mediumTMargin = { mt: 2 };
export const headerStyles = {
  position: 'sticky',
  zIndex: 1,
  top: 0,
  backgroundColor: '#161616',
  p: { xs: 2, sm: 3 },
};
export const progressBarStyles = {
  mt: 1,
  height: 10,
  borderRadius: 999,
  bgcolor: grey[800],
  '& .MuiLinearProgress-bar': {
    borderRadius: 999,
  },
};
export const paperStyles = { p: 2 };
export const radioGroupStyles = {
  display: 'flex',
  width: '100%',
  flexWrap: 'nowrap',
  m: 0,
  '& .MuiFormControlLabel-root': {
    flex: 1,
    m: 0,
    borderRadius: 1,
    py: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
    '&:hover': { backgroundColor: 'action.hover' },
  },
  '& .MuiFormControlLabel-labelPlacementBottom': {
    flexDirection: 'column',
  },
  '& .MuiFormControlLabel-label': {
    fontSize: 12,
    lineHeight: 1.1,
    whiteSpace: 'nowrap',
  },
};
export const footerStyles = { my: 2, display: 'flex', justifyContent: 'flex-end' };