import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserRoutes } from './user.routes'
import { ProfileComponent } from './profile/profile.component'
import { LoginComponent } from './login/login.component'
import { UserComponent } from './user/user.component'

@NgModule({
  declarations: [ProfileComponent, LoginComponent, UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(UserRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})

export class UserModule {}
