import React from 'react';
import { Container } from 'react-bootstrap';

type HomeProps = {
  currentUser: any;
};

const HomePage: React.FC<HomeProps> = ({ currentUser }) => {
  return (
    <Container className="mt-5">
      <div className="bg-light p-5 rounded">
        <h1>Welcome to A-Partner</h1>
        {currentUser && <p>Logged in as {currentUser.username}</p>}
      </div>
    </Container>
  );
};

export default HomePage;
