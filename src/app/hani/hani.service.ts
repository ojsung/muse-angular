import { Injectable } from '@angular/core';

@Injectable()
export class HaniService {

  constructor() { }
  public compareArrays(array1, array2) {
    return (
      array1.length === array2.length && array1.every((value, index) => value === array2[index])
    )
  }
}
