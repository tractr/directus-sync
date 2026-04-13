// TODO: remove this once it is fixed in the SDK
export type FixPolicy<T> = Omit<T, 'roles'> & {
  name: string;
  roles: {
    role: string;
    user: null;
    sort: number;
  }[];
};
