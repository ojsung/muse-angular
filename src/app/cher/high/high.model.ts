export interface IHighControl extends Object {
  str: string
}

export interface IHigh extends Object {
  _id?: string,
  site: string,
  time: Date,
  osTicket: string,
  device: string,
  issue: string,
  summary: string,
  customerCount: number,
  active?: boolean
}