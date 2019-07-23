import { Injectable } from '@angular/core'
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuthService } from '../user/auth.service'

@Injectable()
export class RouteActivator implements CanActivate {
  constructor(public auth: AuthService, public router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // get the maximum allowed role to activate this route
    const minRole = route.data.minRole

    if (!this.isAuthenticated()) {  // If the user is not logged in, send them to the login page
      return this.sendToLogin()
    } else if (!this.isAuthorized(minRole)) {  // If the user is not authorized to access the page, send them home
      return this.returnHome()
    } else { return true }  // If everything went well, authorize the route
  }

  // make sure that the user has a login token
  private isAuthenticated(): boolean {
    if (!this.auth.isAuthenticated()) {
      return false
    } else { return true }
  }

  // make sure that the user has the proper role/permissions to activate this route
  private isAuthorized(minRole): boolean {
    if (this.auth.userType > minRole) {
      return false
    } else { return true }
  }

  // if the user is not authorized, send them to the homepage
  private returnHome(): false {
      this.router.navigate(['/welcome'])
      return false
  }

  private sendToLogin(): false {
    this.router.navigate(['/user/login'])
    return false
  }
}
