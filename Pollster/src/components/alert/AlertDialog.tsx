import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface AlertDialogProps {
    open: boolean; 
    message: string; 
    severity?: AlertColor; 
    onClose: () => void; 
    showDuration?: number;
  }

const AlertDialog: React.FC<AlertDialogProps> = ({ open, message, severity = "info", onClose, showDuration = 2000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={showDuration} 
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertDialog;