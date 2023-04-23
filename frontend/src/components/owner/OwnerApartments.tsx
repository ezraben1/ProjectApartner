import { useState, useEffect } from 'react';
import axios from 'axios';
import { Apartment } from '../../types/models';

const OwnerApartments: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const fetchApartments = async () => {
      const response = await axios.get<Apartment[]>('http://127.0.0.1:8000/owner/owner-apartments/');
      setApartments(response.data);
    };
    fetchApartments();
  }, []);

  return (
    <div>
      <h2>My Apartments</h2>
      <ul>
        {apartments.map((apartment) => (
          <li key={apartment.id}>
            <h3>{apartment.address}</h3>
            <p>{apartment.description}</p>
            <p>Size: {apartment.size} sqft</p>
            <p>Balcony: {apartment.balcony ? 'Yes' : 'No'}</p>
            {/* Add more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OwnerApartments;
