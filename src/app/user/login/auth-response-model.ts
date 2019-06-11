export interface IAuthResponse {
  'token': string;
  'user': {
    '_id': number,
    'firstName': string,
    'lastName': string
  };
}
