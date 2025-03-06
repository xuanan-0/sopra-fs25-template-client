export interface User {
  id: string | null;
  name: string | null;
  username: string | null;
  password?: string | null;
  token: string | null;
  status: string | null;
  creationDate: string | null;
  birthday?: string | null;
}
