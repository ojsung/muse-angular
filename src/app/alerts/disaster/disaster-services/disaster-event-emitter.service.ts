import { Injectable, EventEmitter } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
  // this class handles the initlal bootup of muse.  When muse first initializes, we need to set the values for
  // the needed initialization fields
export class DisasterEventEmitterService {
  constructor() {}
  private eventEmitter: EventEmitter<boolean> = new EventEmitter()

  public emitBoolean(bool) {
    this.eventEmitter.emit(bool)
  }

  public getEventEmitter() {
    return this.eventEmitter
  }
}
