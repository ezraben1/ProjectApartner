import { Room } from '../../../types/types';

interface Props {
  rooms: Room[];
}

function RoomList({ rooms }: Props) {
  return (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>
          <h3>{room.description}</h3>
          <p>Size: {room.size}</p>
          <p>Price per month: {room.price_per_month}</p>
          <p>Window: {room.window ? 'Yes' : 'No'}</p>
        </li>
      ))}
    </ul>
  );
}

export default RoomList;
