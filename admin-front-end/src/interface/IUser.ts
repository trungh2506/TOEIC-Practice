export interface IUser {
  username: string;
  email: string;
  password: string;
  roles: string;
  fullname: string;
  saved_vocabulary: [];
  favorites: [];
  created_at: Date;
}
