export interface IAuthResponse {
  'token': string;
  'user': {
    firstName: string;
    lastName: string;
    userName: string;
    userType: string;
  };
}
