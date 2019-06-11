import { ProfileComponent } from './profile/profile.component'
import { LoginComponent } from './login/login.component'
import { UserComponent } from './user/user.component'

export const UserRoutes = [
  { path: '', component: UserComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent }
]
