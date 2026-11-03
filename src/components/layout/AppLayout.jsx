import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { ToastProvider } from '../ui/Toast.jsx';

export default function AppLayout() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
        <Navbar />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
