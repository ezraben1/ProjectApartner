import { useEffect, useState } from 'react';
import { Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const SingleRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomData, status] = useAuthorizedData<Room>(`/owner/owner-apartments/${id}/room/${id}/`);

  useEffect(() => {
    if (status === 'idle' && roomData) {
      setRoom(roomData);
    }
  }, [roomData, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !room) {
    return <div>Error loading room data.</div>;
  }

  return (
    <div>
      <h1>Room #{room.id}</h1>
      <p>Description: {room.description}</p>
      <p>Size: {room.size}</p>
      <p>Price per month: {room.price_per_month}</p>
      <p>Has window: {room.window ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default SingleRoom;
