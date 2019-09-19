import { ISpeedtest } from './speedtest.interface';
import { ISpeedtestFail } from './speedtest-fails';

export interface ISpeedtestContainer {
  _id?: string,
  date: Date,
  results: Array<ISpeedtest>,
  failed: Array<ISpeedtestFail>
}
