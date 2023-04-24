import React from 'react';

type HomeProps = {
  currentUser: any;
};

const Home: React.FC<HomeProps> = ({ currentUser }) => {
  return (
    <div>
      <h1>Welcome to the home page</h1>
      {currentUser && <p>Logged in as {currentUser.username}</p>}
    </div>
  );
};

export default Home;
