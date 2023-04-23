import React, { useState, useEffect } from 'react';

interface Apartment {
  id: number;
  owner: string;
  address: string;
  description: string;
  size: number;
  bill_ids: Array<number>;
  rooms: Array<{
    id: number;
    description: string;
    size: number;
    price_per_month: number;
    window: boolean;
  }>;
}

interface ApartmentDetailProps {
  apartmentId: number;
}

const ApartmentDetail: React.FC<ApartmentDetailProps> = ({ apartmentId }) => {
  const [apartment, setApartment] = useState<Apartment | null>(null);

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const response = await fetch(`/api/apartments/${apartmentId}/`);
        const data: Apartment = await response.json();
        setApartment(data);
      } catch (error) {
        console.error('Error fetching apartment:', error);
      }
    };

    fetchApartment();
  }, [apartmentId]);

  return (
    <div>
      {apartment ? (
        <>
          <h2>Apartment Detail</h2>
          <p>Owner: {apartment.owner}</p>
          <p>Address: {apartment.address}</p>
          <p>Description: {apartment.description}</p>
          <p>Size: {apartment.size} sqm</p>
          <div>
            <h3>Rooms</h3>
            {apartment.rooms.map((room) => (
              <div key={room.id}>
                <p>Description: {room.description}</p>
                <p>Size: {room.size} sqm</p>
                <p>Price per month: {room.price_per_month}</p>
                <p>Window: {room.window ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading apartment data...</p>
      )}
    </div>
  );
};

export default ApartmentDetail;
