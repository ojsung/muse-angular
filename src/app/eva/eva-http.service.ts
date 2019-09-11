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
  private eeroUrl = 'eero/speedtest'
  public getSpeedtests(): Observable<ISpeedtestContainer[]> {
    return this.getEntry(this.eeroUrl)
  }

  public runSpeedtest(): Observable<ISpeedtestContainer> {
    return this.postEntry(this.eeroUrl, null)
  }
}
