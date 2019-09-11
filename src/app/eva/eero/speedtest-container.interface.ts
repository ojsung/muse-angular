import { ISpeedtest } from './speedtest.interface';

export interface ISpeedtestContainer {
  _id?: string,
  date: Date,
  results: Array<ISpeedtest>,
  failed: Array<number>
}
