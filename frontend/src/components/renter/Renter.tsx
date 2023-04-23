// src/components/renter/Renter.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import ContractDetail from '../ContractDetail';
import BillDetail from '../BillDetail';

const ContractDetailWrapper: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  return <ContractDetail contractId={parseInt(contractId ?? '0')} />;
};

const BillDetailWrapper: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  return <BillDetail billId={parseInt(billId ?? '0')} />;
};

const Renter: React.FC = () => {
  return (
    <div>
      <h1>Renter Dashboard</h1>
      <Routes>
        <Route path="my-room/:room_id/contracts/:contract_id" element={<ContractDetailWrapper />} />
        <Route path="my-room/:room_id/bills" element={<BillDetailWrapper />} />
      </Routes>
    </div>
  );
};

export default Renter;
