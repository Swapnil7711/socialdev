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

export interface PostTypes {
  id: number;
  content: string | null;
  image: string | null;
  userId: number;
  likes?: Like[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LikeTypes {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentTypes {
  id: number;
  content: string;
  postId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
