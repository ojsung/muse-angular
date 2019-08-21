import { Injectable } from '@angular/core'
import { IDisaster } from '../disaster.model'

@Injectable({
  providedIn: 'root'
})
export class DisasterFilterService {
  private notMatched = -1
  constructor() {}

  /**
   * @returns an array of filtered sites
   * @param filterBy the string by which to filter
   * @param finalArray The array to which the changes will be added
   */
  public performFilter(filterBy: string, finalArray): any[] {
    const filteredSites = []
    return this.siteFilter(filteredSites, filterBy, finalArray)
  }

  private siteFilter(filteredSites, filterBy: string, finalArray): any[] {
    filterBy = filterBy.toLocaleLowerCase()
    // get the names of all sites
    this.getSiteNames(finalArray, filterBy, filteredSites)
    return filteredSites
  }

  private getSiteNames(
    finalArray: any,
    filterBy: string,
    filteredSites: any[]
  ) {
    finalArray.forEach(disaster => {
      const disasterArray: IDisaster[] = disaster[1]
      for (const subDisaster of disasterArray) {
        if (subDisaster.site.toLocaleLowerCase().indexOf(filterBy) !== this.notMatched) {
          let matchIndex = this.notMatched
          // if there is a match, check if the site's parent is already listed in the list of downed parents
          const leng = filteredSites.length
          for (let j = 0; j < leng; j++) {
            if (filteredSites[j][0] === disaster[0]) {
              matchIndex = j
              break
            }
          }
          // matchIndex will be the index of the CBNL AP or -1 if the CBNL isn't already added
          this.pushSiteByIndex(matchIndex, filteredSites, disaster, subDisaster)
        }
      }
    })
  }

  // if the CBNL already has downed sites, add the matched site to the list of downed sites
  // else add the CBNL to the list of downed sites
  private pushSiteByIndex(
    matchIndex: number,
    filteredSites: any[],
    disaster: any,
    subDisaster: IDisaster
  ) {
    if (matchIndex === this.notMatched) {
      filteredSites.push([disaster[0], [subDisaster]])
    } else {
      filteredSites[matchIndex][1].push(subDisaster)
    }
  }
}
