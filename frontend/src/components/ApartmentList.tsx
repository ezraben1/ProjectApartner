import React from 'react';
import { Link } from 'react-router-dom';
import { Apartment } from '../types/models';

interface ApartmentListProps {
  apartments: Apartment[];
}

const ApartmentList: React.FC<ApartmentListProps> = ({ apartments }) => {
  return (
    <div>
      <h2>My Apartments</h2>
      <ul>
        {apartments.map((apartment) => (
          <li key={apartment.id}>
            <Link to={`/owner/apartments/${apartment.id}`}>{apartment.address}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApartmentList;
