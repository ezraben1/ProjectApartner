import { useEffect, useState } from "react";
import api from "../utils/api";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.get("/core/me/");
      const users = await response.json();
      if (users.length > 0) {
        setUser(users[0]);
      }
    };
  
    fetchUser();
  }, []);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
    </div>
  );
}

export default Profile;
