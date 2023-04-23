export interface CustomUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface Apartment {
  id: number;
  address: string;
  description: string;
  size: number;
  balcony: boolean;
  bbq_allowed: boolean;
  smoking_allowed: boolean;
  allowed_pets: boolean;
  ac: boolean;
  rooms: Room[];
  owner: CustomUser;
}


export interface ApartmentImage {
  id: number;
  apartment: Apartment;
  image: string;
}

export interface Room {
  images: any;
  id: number;
  apartment: Apartment;
  renter: CustomUser | null;
  description: string | null;
  price_per_month: number;
  size: string;
  window: boolean;
  ac: boolean;
}

export interface RoomImage {
  id: number;
  room: number;
  image: string;
}

export interface Contract {
  id: number;
  room: number;
  owner: number;
  start_date: string;
  end_date: string;
  rent_amount: string;
  deposit_amount: string;
  terms_and_conditions?: string;
}

export type BillType = 'electricity' | 'gas' | 'water' | 'rent' | 'other';

export interface Bill {
  id: number;
  apartment: number;
  bill_type: BillType;
  amount: string;
  date: string;
  paid: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  document?: string;
  files: BillFile[];
}

export interface BillFile {
  id: number;
  bill: number;
  file: string;
}

export interface Review {
  id: number;
  product: number;
  name: string;
  description: string;
  date: string;
}
