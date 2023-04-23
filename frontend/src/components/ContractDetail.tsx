import React, { useState, useEffect } from 'react';

interface Contract {
  id: number;
  room_id: number;
  apartment_id: number;
  start_date: string;
  end_date: string;
  deposit_amount: number;
  rent_amount: number;
}

interface ContractDetailProps {
  contractId: number;
}

const ContractDetail: React.FC<ContractDetailProps> = ({ contractId }) => {
  const [contract, setContract] = useState<Contract | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}/`);
        const data: Contract = await response.json();
        setContract(data);
      } catch (error) {
        console.error('Error fetching contract:', error);
      }
    };

    fetchContract();
  }, [contractId]);

  return (
    <div>
      {contract ? (
        <>
          <h2>Contract Detail</h2>
          <p>Room ID: {contract.room_id}</p>
          <p>Apartment ID: {contract.apartment_id}</p>
          <p>Start Date: {contract.start_date}</p>
          <p>End Date: {contract.end_date}</p>
          <p>Deposit Amount: {contract.deposit_amount}</p>
          <p>Rent Amount: {contract.rent_amount}</p>
        </>
      ) : 
      (<p>Loading contract data...</p>
      )}
    </div>
  );
};

export default ContractDetail;

       
