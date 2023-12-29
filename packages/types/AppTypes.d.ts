export interface UserType {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  content: string | null;
  image: string | null;
  userId: number;
  likes?: Like[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
