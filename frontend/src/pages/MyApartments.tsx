import { useEffect, useState } from 'react';
import axios from 'axios';
import { Apartment, Room } from '../types';

const MyApartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/core/test/');
        setApartments(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchApartments();
  }, []);

  return (
    <div>
      <h1>My Apartments</h1>
      {apartments.map((apartment: Apartment) => (
        <div key={apartment.id}>
          <h2>{apartment.address}</h2>
          <p>{apartment.description}</p>
          <ul>
            {apartment.rooms.map((room: Room) => (
              <li key={room.id}>
                <h3>{room.description}</h3>
                <p>Price per month: {room.price_per_month}</p>
                <p>Size: {room.size}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyApartments;
