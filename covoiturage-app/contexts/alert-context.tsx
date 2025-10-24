import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomAlert, AlertType } from '@/components/custom-alert';

interface AlertOptions {
  type?: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    options: AlertOptions;
  }>({
    visible: false,
    options: {
      type: 'info',
      title: '',
      message: '',
    },
  });

  const showAlert = (options: AlertOptions) => {
    setAlertState({
      visible: true,
      options,
    });
  };

  const hideAlert = () => {
    setAlertState((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const showSuccess = (title: string, message: string) => {
    showAlert({
      type: 'success',
      title,
      message,
      confirmText: 'OK',
      onConfirm: hideAlert,
    });
  };

  const showError = (title: string, message: string) => {
    showAlert({
      type: 'error',
      title,
      message,
      confirmText: 'OK',
      onConfirm: hideAlert,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    showAlert({
      type: 'confirm',
      title,
      message,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      showCancel: true,
      onConfirm: () => {
        onConfirm();
        hideAlert();
      },
      onCancel: () => {
        if (onCancel) onCancel();
        hideAlert();
      },
    });
  };

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showConfirm,
        hideAlert,
      }}
    >
      {children}
      <CustomAlert
        visible={alertState.visible}
        type={alertState.options.type}
        title={alertState.options.title}
        message={alertState.options.message}
        confirmText={alertState.options.confirmText}
        cancelText={alertState.options.cancelText}
        onConfirm={alertState.options.onConfirm}
        onCancel={alertState.options.onCancel}
        showCancel={alertState.options.showCancel}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};


