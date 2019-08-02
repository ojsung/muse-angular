import { Injectable, OnInit, OnDestroy } from '@angular/core'
import { SocketService } from '../shared/socket.service'
import { AuthService } from '../user/auth.service'

@Injectable({
  providedIn: 'root'
})
export class CherSocketService extends SocketService implements OnInit, OnDestroy {
  constructor(protected auth: AuthService) {
    super(auth)
    this.ioSocket.io.uri += '/alerts'
    this.ioSocket.nsp += '/alerts'
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.disconnect()
  }
}
