// src/types/models.d.ts

export interface CustomUser {
    id: number;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    user_type: "owner" | "renter" | "searcher";
    custom_groups: Group[];
    custom_user_permissions: Permission[];
    apartments_owned: Apartment[];
    rooms_rented: Room[];
    contracts_owned: Contract[];
    bills_created: Bill[];
  }
  
  export interface Group {
    id: number;
    name: string;
    permissions: Permission[];
    custom_users: CustomUser[];
  }
  
  export interface Permission {
    id: number;
    name: string;
    content_type: number;
    codename: string;
    custom_users: CustomUser[];
    custom_groups: Group[];
  }
  
  export interface Apartment {
    id: number;
    owner: CustomUser;
    address: string;
    description: string;
    size: string;
    balcony: boolean;
    bbq_allowed: boolean;
    smoking_allowed: boolean;
    allowed_pets: boolean;
    ac: boolean;
    images: ApartmentImage[];
    rooms: Room[];
    bills: Bill[];
  }
  
  export interface ApartmentImage {
    id: number;
    apartment: Apartment;
    image: string; // URL or Base64 encoded string
  }
  
  export interface Room {
    id: number;
    apartment: Apartment;
    renter: CustomUser | null;
    description: string | null;
    price_per_month: string;
    size: string;
    window: boolean;
    ac: boolean;
    images: RoomImage[];
    contract: Contract | null;
    reviews: Review[];
  }
  
  export interface RoomImage {
    url: string | undefined;
    id: number;
    room: Room;
    image: string; // URL or Base64 encoded string
  }
  
  export interface Contract {
    id: number;
    room: Room;
    owner: CustomUser;
    start_date: string;
    end_date: string;
    rent_amount: string;
    deposit_amount: string;
    terms_and_conditions: string | null;
  }
  
  export interface Bill {
    id: number;
    apartment: Apartment;
    bill_type: "electricity" | "gas" | "water" | "rent" | "other";
    amount: string;
    date: string;
    paid: boolean;
    created_by: CustomUser;
    created_at: string;
    updated_at: string;
    document: string | null; // URL or Base64 encoded string
    files: BillFile[];
  }
  
  export interface BillFile {
    id: number;
    bill: Bill;
    file: string; // URL or Base64 encoded string
  }
  
  export interface Review {
    id: number;
    room: Room;
    name: string;
    description: string;
    date: string;
  }
  