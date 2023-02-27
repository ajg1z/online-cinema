export interface UserFindOnePayload {
  email?: string;
}

export interface UserSearchParams {
  email: RegExp;
}
