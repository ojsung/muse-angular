import { Injectable } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../user/auth.service';
import { Observable } from 'rxjs';
import { ISpeedtestContainer } from './eero/speedtest-container.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaHttpService extends HttpService {

  constructor(protected http: HttpClient, public auth: AuthService) {
    super(http, auth)
  }
  private speedtestUrl = 'eero/speedtest'
  private networkUrl = 'eero'
  public getSpeedtests(): Observable<ISpeedtestContainer[]> {
    return this.getEntry(this.speedtestUrl)
  }

  public runSpeedtest(): Observable<ISpeedtestContainer> {
    return this.postEntry(this.speedtestUrl, null)
  }

  public updateNetwork(update: any): Observable<any> {
    return this.putEntry(this.networkUrl, update)
  }
}
