import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AlertState {
  open: boolean;
  message: string;
  severity: "info" | "success" | "warning" | "error";
  showDuration: number;
}

interface AlertContextType {
  alert: AlertState;
  showAlert: (message: string, severity?: AlertState["severity"], showDuration?: number) => void;
  closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode; 
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
    showDuration: 2000
  });

  const showAlert = useCallback((message: string, severity: AlertState["severity"] = "info", showDuration: number = 2000) => {
    console.log("Show duration", showDuration);
    
    setAlert({ open: true, message, severity, showDuration: showDuration });
  }, []);

  const closeAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
