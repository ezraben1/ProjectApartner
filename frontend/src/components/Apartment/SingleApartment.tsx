import { useEffect, useState } from 'react';
import { Apartment, Room } from '../../types';
import { useAuthorizedData } from '../../utils/useAuthorizedData';
import { ListGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const SingleApartment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [apartmentData, status] = useAuthorizedData<Apartment>(`/owner/owner-apartments/${id}/`);

  useEffect(() => {
    if (status === 'idle' && apartmentData) {
      setApartment(apartmentData);
    }
  }, [apartmentData, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error' || !apartment) {
    return <div>Error loading apartment data.</div>;
  }

  return (
    <div>
      <h1>{apartment.address}</h1>
      <p>{apartment.description}</p>
      <ListGroup variant="flush">
        {apartment.rooms.map((room: Room) => (
          <Link key={room.id} to={`/owner/my-apartments/${apartment.id}/room/${room.id}`}>
            <ListGroup.Item>
              <h3>{room.description}</h3>
              <p className="mb-0">Price per month: {room.price_per_month}</p>
              <p className="mb-0">Size: {room.size}</p>
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </div>
  );
};

export default SingleApartment;
