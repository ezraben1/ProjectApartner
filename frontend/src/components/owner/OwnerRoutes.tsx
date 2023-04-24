import { Route, Routes } from "react-router-dom";
import MyApartments from "../../components/Apartment/MyApartments";
import MyRooms from "../../components/Apartment/Room/MyRooms";
import useFetchRooms from "../../components/Apartment/Room/useFetchRooms";

//import /* Import all your owner-related components here */;

const OwnerRoutes = () => {
  const { loading, error } = useFetchRooms('/owner/owner-rooms/');
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>; 

  return (
    <Routes>
      <Route path="/owner/my-apartments" element={<MyApartments />} />
      {/* <Route path="/owner/apartments/:apartmentId/bills/:billId" element={<OwnerBillDetail />} />
      <Route path="/owner/apartments/:apartmentId/contracts/:contractId" element={<OwnerContractDetail />} />
      <Route path="/owner/apartments/:apartmentId/rooms/:roomId" element={<OwnerRoomDetail />} />
      <Route path="/owner/apartments/:apartmentId/rooms/:roomId/contracts/:contractId" element={<OwnerRoomContractDetail />} />
      <Route path="/owner/contracts" element={<OwnerContracts />} />
      <Route path="/owner/contracts/:contractId" element={<OwnerContractDetail />} />
      <Route path="/owner/rooms/:roomId/create-contract" element={<OwnerCreateContract />} />
      <Route path="/owner/rooms/:roomId/contracts/:contractId" element={<OwnerRoomContractDetail />} /> */}
      <Route path="/owner/owner-rooms" element={<MyRooms />} />

    </Routes>
  );
};

export default OwnerRoutes;
