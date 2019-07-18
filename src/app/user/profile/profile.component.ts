import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'
import { restrictedWords } from '../../shared/restricted-words.validator'
import { IUser } from '../user.model'

@Component({
  selector: 'cher-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup
  private currentUser: IUser
  private firstName: FormControl
  private lastName: FormControl
  private password: FormControl
  private newPassword: FormControl
  private get formValues() {
    return this.profileForm.value
  }

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser()
    this.firstName = new FormControl(this.currentUser.firstName, [
      Validators.required,
      Validators.pattern('[a-zA-Z].*'),
      restrictedWords
    ])
    this.lastName = new FormControl(this.currentUser.lastName, [
      Validators.required,
      Validators.pattern('[a-zA-Z].*'),
      restrictedWords([
        'anal',
        'anus',
        'arse',
        'ass',
        'ballsack',
        'balls',
        'bastard',
        'bitch',
        'biatch',
        'bloody',
        'blowjob',
        'blow job',
        'bollock',
        'bollok',
        'boner',
        'boob',
        'bugger',
        'bum',
        'butt',
        'buttplug',
        'clitoris',
        'cock',
        'coon',
        'crap',
        'cunt',
        'damn',
        'dick',
        'dildo',
        'dyke',
        'fag',
        'feck',
        'fellate',
        'fellatio',
        'felching',
        'fuck',
        'f u c k',
        'fudgepacker',
        'fudge packer',
        'flange',
        'Goddamn',
        'God damn',
        'hell',
        'homo',
        'jerk',
        'jizz',
        'knobend',
        'knob end',
        'labia',
        'lmao',
        'lmfao',
        'muff',
        'nigger',
        'nigga',
        'omg',
        'penis',
        'piss',
        'poop',
        'prick',
        'pube',
        'pussy',
        'queer',
        'scrotum',
        'sex',
        'shit',
        's hit',
        'sh1t',
        'slut',
        'smegma',
        'spunk',
        'tit',
        'tosser',
        'turd',
        'twat',
        'vagina',
        'wank',
        'whore',
        'wtf'
      ])
    ])
    this.password = new FormControl(null)
    this.profileForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      newPassword: this.newPassword
    })
  }
  cancel() {
    this.router.navigate(['welcome'])
  }
  saveProfile() {
    if (this.profileForm.valid) {
      if (this.formValues.password) {
        // this.updatePassword(this.formValues.password)
      }
      this.auth
        .updateCurrentUser(
          this.formValues.firstName,
          this.formValues.lastName,
          this.formValues.password
        )
        .subscribe({
          complete: () => {
            console.log('successfully saved')
          }
        })
    }
  }
  validateFirstName() {
    return (
      this.profileForm.controls.firstName.valid || this.profileForm.controls.firstName.untouched
    )
  }

  validateLastName() {
    return this.profileForm.controls.lastName.valid || this.profileForm.controls.lastName.untouched
  }

  // updatePassword(password: string) {
  //   this.auth.updatePassword(password)
  // }
}
