export interface JwtPayload {
  /** User UUID */
  sub: string;
  email: string;
  name: string;
}
