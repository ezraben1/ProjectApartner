// src/components/searcher/Searcher.tsx

import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import RoomDetail from '../RoomDetail';
import ContractDetail from '../ContractDetail';

const RoomDetailWrapper: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  return <RoomDetail roomId={parseInt(roomId ?? '0')} />;
};

const ContractDetailWrapper: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  return <ContractDetail contractId={parseInt(contractId ?? '0')} />;
};


const Searcher: React.FC = () => {
  return (
    <div>
      <h1>Searcher Dashboard</h1>
      <Routes>
        <Route path="searcher-search/:apartment_id/room/:room_id" element={<RoomDetailWrapper />} />
        <Route path="searcher-search/:apartment_id/room/:room_id/contact-owner" element={<RoomDetailWrapper />} />
        <Route path="searcher-search/:apartment_id/room/:room_id/contracts" element={<RoomDetailWrapper />} />
        <Route path="searcher-search/:apartment_id/room/:room_id/sign-contract" element={<RoomDetailWrapper />} />
        <Route path="searcher-search/:apartment_id/room/:room_id/contract/:contract_id" element={<ContractDetailWrapper />} />
      </Routes>
    </div>
  );
};

export default Searcher;
