import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 100px)', padding: '2rem' }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
