import React, { useState, useEffect } from 'react';

interface Room {
    roomId?: number;
  id: number;
  description: string;
  size: number;
  price_per_month: number;
  window: boolean;
  images: Array<{ id: number; image: string }>;
  apartment_id: number;
  contract: number;
  renter: number;
}

interface RoomDetailProps {
  roomId: number;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ roomId }) => {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/`);
        const data: Room = await response.json();
        setRoom(data);
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    };

    fetchRoom();
  }, [roomId]);

  return (
    <div>
      {room ? (
        <>
          <h2>Room Detail</h2>
          <p>Description: {room.description}</p>
          <p>Size: {room.size} sqm</p>
          <p>Price per month: {room.price_per_month}</p>
          <p>Window: {room.window ? 'Yes' : 'No'}</p>
          <p>Apartment ID: {room.apartment_id}</p>
          <p>Contract ID: {room.contract}</p>
          <p>Renter ID: {room.renter}</p>
          <div>
            <h3>Images</h3>
            {room.images.map((image) => (
              <img key={image.id} src={image.image} alt="Room" />
            ))}
          </div>
        </>
      ) : (
        <p>Loading room data...</p>
      )}
    </div>
  );
};

export default RoomDetail;
