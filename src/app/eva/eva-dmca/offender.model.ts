export interface IOffender {
  _id?: string,
  azotelId: string,
  azotelName: string,
  infractionCount: number,
  CPEMAC: string,
  routerMAC: string,
  email: string,
  infractionHistory: Array<string>,
  emailed: boolean
}