import { useEffect, useState } from 'react';
import { Apartment, Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';

const MyApartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [apartmentData, status] = useAuthorizedData<Apartment[]>('/owner/owner-apartments/');


  useEffect(() => {
    if (status === 'idle' && apartmentData) {
      setApartments(apartmentData);
    }
  }, [apartmentData, status]);

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
