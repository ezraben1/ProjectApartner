import { Route, Routes, NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ApartmentDetail from '../ApartmentDetail';
import ApartmentList from '../ApartmentList';

const ApartmentDetailWrapper: React.FC = () => {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  return <ApartmentDetail apartmentId={parseInt(apartmentId ?? '0')} />;
};

function OwnerApartments() {
  return (
    <div>
      <h2>My Apartments</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/owner/apartments">Apartments List</NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<ApartmentList apartments={[]} />} />
        <Route path="/:apartmentId" element={<ApartmentDetailWrapper />} />
      </Routes>
    </div>
  );
}

export default OwnerApartments;
