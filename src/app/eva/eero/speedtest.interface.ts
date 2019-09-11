export interface ISpeedtest {
  owner: string,
  speed: {
    status: string,
    date: Date,
    up: {
      value: number,
      units: string
    },
    down: {
      value: number,
      units: string
    }
  },
  "network id": number
}
