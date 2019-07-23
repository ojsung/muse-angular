import { OnDestroy, Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit, OnDestroy {

  constructor() { }


  ngOnInit() {
    console.log('I made it here')
  }

  ngOnDestroy() {
  }

}
