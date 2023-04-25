import React, { useEffect, useState } from 'react';
import { AspectRatio, Box, Button, Heading, SimpleGrid } from '@chakra-ui/react';
import { Card } from 'react-bootstrap';
import { Room } from '../../types';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/core/test/');
      const data = await response.json();

      if (Array.isArray(data.results)) {
        setRooms(data.results);
      } else {
        console.error('Invalid room data received:', data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);


  return (
    <Box>
      <Heading as="h1" size="xl" textAlign="center" my={8}>
        Available Rooms
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={10} px={8}>
        {rooms.map((room) => (
          <Link to={`/test/${room.id}`} key={room.id} style={{ textDecoration: 'none' }}>
            <Card className="h-100 shadow-sm" style={{ width: '18rem', borderRadius: '12px' }}>
              <AspectRatio ratio={4 / 3}>
                <Card.Img
                  variant="top"
                  src={room.images[0] ? room.images[0].url : 'https://via.placeholder.com/150'}
                  style={{ objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                />
              </AspectRatio>
              <Card.Body>
                <Card.Title>{room.apartment?.address || 'No address available'}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {room.description}
                </Card.Text>
                <Card.Text>
                  <strong>Size:</strong> {room.size}
                </Card.Text>
                <Card.Text>
                  <strong>Price per month:</strong> ${room.price_per_month}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button colorScheme="teal" size="sm" as={Link} to={`/test/${room.id}`}>
                  View Details
                </Button>
              </Card.Footer>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};


export default HomePage;