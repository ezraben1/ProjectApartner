import React from 'react';
import { Room } from '../../../types';

interface RoomListProps {
  rooms: Room[] | null;
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  return (
    <div>
      <h2>Rooms</h2>
      <ul>
        {rooms?.map((room) => (
          <li key={room.id}>
            <h3>{room.description}</h3>
            <p>Size: {room.size}</p>
            <p>Price per month: {room.price_per_month}</p>
            <p>Window: {room.window ? 'Yes' : 'No'}</p>
            {/* Add more room details if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
