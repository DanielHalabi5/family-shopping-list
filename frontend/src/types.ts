export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
  familyId?: string | null;
    createdAt: string;
  updatedAt: string;
};

export type Family = {
  id: string;
  name: string;
  ownerId: string;
  members?: string[];
  createdAt: string;
  updatedAt: string;
};

export type JoinRequest = {
  id: string;
  userId: string;
  userName: string;
  familyId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export type List = {
  id: string;
  familyId: string;
  start: string;
  end: string;
  items?: ShoppingItem[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  purchased: boolean;
  status?: 'INCLUDED' | 'PURCHASED';
  listId: string;
  owner?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};