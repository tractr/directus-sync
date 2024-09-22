// TODO: remove this once it is fixed in the SDK
export type FixSettings<T> = T & {
  public_registration_role: string | null;
};
