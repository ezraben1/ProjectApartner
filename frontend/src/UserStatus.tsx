import React from 'react';

interface Props {
  username: string;
}

const UserStatus: React.FC<Props> = ({ username }) => {
  return (
    <div>
      <p>Welcome, {username}!</p>
    </div>
  );
};

export default UserStatus;
