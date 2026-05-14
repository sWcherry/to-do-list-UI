import { Snackbar, Alert } from "@mui/material"

function SnackbarAlert({ open, message, onClose }: any) {

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
    >
      <Alert severity="success">
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarAlert