export interface IOffender {
  _id?: string,
  azotelId: string,
  infractionCount: number,
  CPEMAC: string,
  routerMAC: string,
  email: string,
  infractionDate: string,
  infractionInfo: string,
  emailed: boolean
}
