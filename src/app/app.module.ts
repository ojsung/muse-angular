import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppComponent } from './app.component'
import { AlertsModule } from './alerts/alerts.module'
import { SharedModule } from './shared/shared.module'
import { WelcomeComponent } from './welcome/welcome.component'
import { AppRoutingModule } from './app-routing.module'
import { AuthService } from './user/auth.service'
import { RouteActivator } from './shared/route-activator.service'
import { NavComponent } from './nav/nav.component'
import { AuthInterceptorService } from './user/auth-interceptor.service'
import 'zone.js';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AlertsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    RouteActivator,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
