import { Injectable } from '@angular/core';
import { HttpService } from '../shared/http.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../user/auth.service';

@Injectable()
export class HaniHttpService extends HttpService {

  constructor(protected http: HttpClient, public auth: AuthService) {
    super(http, auth)
  }
  
}
