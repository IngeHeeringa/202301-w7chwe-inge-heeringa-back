export interface UserCredentialsStructure {
  username: string;
  password: string;
}

export interface UserDataStructure extends UserCredentialsStructure {
  email: string;
  avatar: string;
}
