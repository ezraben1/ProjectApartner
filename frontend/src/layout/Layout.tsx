import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="content flex-grow-1">
        <Main>{children}</Main>
      </div>
      {children && <Footer />}
    </div>
  );
};

export default Layout;
