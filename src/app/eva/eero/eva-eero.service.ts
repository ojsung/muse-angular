import { Injectable } from '@angular/core'
import { ISpeedtestContainer } from './speedtest-container.interface'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root'
})
export class EvaEeroService {
  constructor(private ds: DomSanitizer) {}

  public speedtestContainerToCSV(speedtestContainers: ISpeedtestContainer[]): string {
    let csv =
      'Batch Date,Individual Date,Owner,Network ID,Internal ID,Eero SN,Device,Down Value,Down Units,Up Value,Up Units\n'
    speedtestContainers.forEach(speedtestContainer => {
      const batchDate = speedtestContainer.date
      const failedArray = speedtestContainer.failed
      if (failedArray.length) {
        failedArray.forEach(fail => {
          const owner = fail.owner
          const networkId = fail.networkId
          const internalId = fail.internalId
          const eeroSN = fail.eeroSN
          const device = fail.device
          csv += `${batchDate},FAILED,${owner},${networkId},${internalId},${eeroSN},${device}\n`
        })
      }
      speedtestContainer.results.forEach(speedtest => {
        const owner = speedtest.owner
        const networkId = speedtest.networkId
        const internalId = speedtest.internalId
        const eeroSN = speedtest.eeroSN
        const device = speedtest.device
        const down = speedtest.speed.down
        const downspeed = down.value
        const downunits = down.units
        const up = speedtest.speed.up
        const upspeed = up.value
        const upunits = up.units
        const individualDate = speedtest.speed.date
        csv += `${batchDate},${individualDate},${owner},${networkId},${internalId},${eeroSN},${device},${downspeed},${downunits},${upspeed},${upunits}\n`
      })
      csv += '\n'
    })
    return csv
  }

  public createDownloadableCSV(csv: string): SafeResourceUrl {
    const blob: Blob = new Blob([csv], { type: 'text/csv' })
    const unsanitizedFileUrl: string = window.URL.createObjectURL(blob)
    const fileUrl: SafeResourceUrl = this.ds.bypassSecurityTrustResourceUrl(unsanitizedFileUrl)
    return fileUrl
  }
}
