import { Injectable, EventEmitter } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
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
