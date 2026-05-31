import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1A1A1A',
          color: '#FFF8F0',
          border: '1px solid rgba(255, 248, 240, 0.1)',
          borderRadius: '0.75rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.875rem',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#F5A623', secondary: '#0D0D0D' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#0D0D0D' },
        },
      }}
    />
  );
}
