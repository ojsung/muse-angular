import { ISpeedtestFail } from '../speedtest-fails';

export interface INetwork extends ISpeedtestFail {
  owner: string
  networkId: number
  internalId: number | string
  eeroSN: string
  device: string
  tower: string
}