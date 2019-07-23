import { Injectable } from '@angular/core'
import { AbstractControl, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HighService {
  constructor() {}

  private subManager: Subscription

  private validationMessages = {
    required: 'This field is required.',
    email: 'Please enter a valid email.',
    minlength: 'Please enter valid information.'
  }

  // for any controls that need to be watched, this can be used to watch the control and
  // update the message when it needs to be changed
  setSubscription(control: AbstractControl, message: { str: string }): () => void {
    this.subManager = control.valueChanges.subscribe({
      next: () => {
        this.setMessage(control, message)
      }
    })

    return function destroySub() {
      this.subManager.unsubscribe()
    }
  }

  // updates the validation and the validation needs for a form field change
  setValidation(summaryArray: Array<any>): void {
    this.subManager = summaryArray[0].valueChanges.subscribe({
      next: value => {
        this.validationChanger(summaryArray, value)
        summaryArray[1].updateValueAndValidity()
      }
    })
  }

  validationChanger(summaryArray: Array<any>, value) {
    if (value === 'Other') {
      summaryArray[1].setValidators(Validators.required)
    } else {
      summaryArray[1].clearValidators()
    }
  }

  removeSubscription(control: AbstractControl): void {
    this.subManager = control.valueChanges.subscribe()
  }

  private setMessage(control: AbstractControl, message: { str: string }): void {
    message.str = ''
    if ((control.touched || control.dirty) && control.errors) {
      message.str = Object.keys(control.errors)
        .map(key => (message.str += this.validationMessages[key]))
        .join(' ')
    }
  }
}
