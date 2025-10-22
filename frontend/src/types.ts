export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
  familyId?: string;
};


export type Family = {
  id: string;
  name: string;
  ownerId: string;
  members: string[];
};

export type JoinRequest = {
  id: string;
  userId: string;
  userName: string;
  familyId: string;
  status: 'pending' | 'approved' | 'rejected';
};
