import { Injectable } from '@angular/core'
import { IDisaster } from '../disaster.model'

@Injectable({
  providedIn: 'root'
})
export class DisasterService {
  constructor() {}

  public keyCollection(filteredDisasters, finalObject) {
    // collect all keys
    filteredDisasters.forEach(obj => {
      const objKeys = obj.parent
      finalObject[objKeys] = []
    })
    // push to final object
    this.addSitesToCBNL(finalObject, filteredDisasters)
  }

  private addSitesToCBNL(finalObject: object, filteredDisasters: IDisaster[]) {
    Object.keys(finalObject).forEach(CBNL => {
      filteredDisasters.forEach(site => {
        const disaster: IDisaster = site
        if (!finalObject[CBNL].includes(disaster.site) && disaster.parent === CBNL) {
          finalObject[CBNL].push(disaster)
        }
      })
    })
  }
}
