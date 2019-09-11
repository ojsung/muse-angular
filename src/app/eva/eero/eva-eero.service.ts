import { Injectable } from '@angular/core'
import { ISpeedtestContainer } from './speedtest-container.interface'

@Injectable({
  providedIn: 'root'
})
export class EvaEeroService {

  constructor() { }

  public speedtestContainerToCSV(speedtestContainers: ISpeedtestContainer[]): string {
    let csv = 'Date,Owner,Network ID,Down Value,Down Units,Up Value,Up Units\n'
    speedtestContainers.forEach(speedtestContainer => {
      const date = speedtestContainer.date
      speedtestContainer.results.forEach(speedtest => {
        const networkId = speedtest["network id"]
        const owner = speedtest.owner
        const down = speedtest.speed.down
        const downspeed = down.value
        const downunits = down.units
        const up = speedtest.speed.up
        const upspeed = up.value
        const upunits = up.units
        csv += `${date},${owner},${networkId},${downspeed},${downunits},${upspeed},${upunits}\n`
      })
      csv += '\n'
    })
    return csv
  }
}
