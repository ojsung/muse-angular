import { ISpeedtestFail } from './speedtest-fails'

export interface ISpeedtest extends ISpeedtestFail {
  speed: {
    status: string
    date: Date
    up: {
      value: number
      units: string
    }
    down: {
      value: number
      units: string
    }
  }
}
