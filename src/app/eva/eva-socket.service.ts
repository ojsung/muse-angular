import { Injectable, OnInit, OnDestroy } from '@angular/core'
import { AuthService } from '../user/auth.service'
import { SocketService } from '../shared/socket.service'
import { IOffender } from './eva-dmca/offender.model'

@Injectable({
  providedIn: 'root'
})
export class EvaSocketService extends SocketService implements OnInit, OnDestroy {
  constructor(protected auth: AuthService) {
    super(auth)
    this.ioSocket.io.uri += '/eva'
    this.ioSocket.nsp += '/eva'
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.disconnect()
  }

  public submitChange(entryName: string, change: IOffender) {
    const validChange = this.validateChange(change)
    if (validChange) {
      this.emit(`submit ${entryName}`, change)
    }
  }

  public useRow(entryName: string, row: number) {
    this.emit(`using ${entryName}`, row)
  }

  public leaveRow(entryName: string, row: number) {
    this.emit(`left ${entryName}`, row)
  }

  private validateChange(change): boolean {
    const keys = Object.keys(change)
    let emptyFieldCount = 0
    keys.forEach(key => {
      if (key !== 'emailed' && !change[key]) {
        ++emptyFieldCount
      }
    })
    return !emptyFieldCount
  }
}
