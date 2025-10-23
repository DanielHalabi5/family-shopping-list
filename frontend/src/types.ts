export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
  familyId?: string | null;
};

export type Family = {
  id: string;
  name: string;
  ownerId: string;
  members?: string[];
};

export type JoinRequest = {
  id: string;
  userId: string;
  userName: string;
  familyId: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type List = {
  id: string;
  familyId: string;
  start: string;
  end: string;
  items?: ShoppingItem[];
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
};