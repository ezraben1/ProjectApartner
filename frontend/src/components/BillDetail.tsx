import React, { useState, useEffect } from 'react';

interface Bill {
  id: number;
  apartment: number;
  bill_type: string;
  amount: number;
  date: string;
  created_by: number;
  created_at: string;
  document: string;
}

interface BillDetailProps {
  billId: number;
}

const BillDetail: React.FC<BillDetailProps> = ({ billId }) => {
  const [bill, setBill] = useState<Bill | null>(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await fetch(`/api/bills/${billId}/`);
        const data: Bill = await response.json();
        setBill(data);
      } catch (error) {
        console.error('Error fetching bill:', error);
      }
    };

    fetchBill();
  }, [billId]);

  return (
    <div>
      {bill ? (
        <>
          <h2>Bill Detail</h2>
          <p>Apartment ID: {bill.apartment}</p>
          <p>Bill Type: {bill.bill_type}</p>
          <p>Amount: {bill.amount}</p>
          <p>Date: {bill.date}</p>
          <p>Created by: {bill.created_by}</p>
          <p>Created at: {bill.created_at}</p>
          <p>Document: {bill.document}</p>
        </>
      ) : (
        <p>Loading bill data...</p>
      )}
    </div>
  );
};

export default BillDetail;
