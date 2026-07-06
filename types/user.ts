export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  createdAt: Date;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  createdAt: string;
};
