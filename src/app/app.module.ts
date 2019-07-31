import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { WelcomeComponent } from './welcome/welcome.component'
import { AppRoutingModule } from './app-routing.module'
import { AuthService } from './user/auth.service'
import { RouteActivator } from './shared/route-activator.service'
import { NavComponent } from './nav/nav.component'
import { AuthInterceptorService } from './user/auth-interceptor.service'
import { HaniModule } from './hani/hani.module'
import 'zone.js'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { EvaModule } from './eva/eva.module'
import { SocketIoModule,  } from 'ngx-socket-io'

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    HaniModule,
    NgbModule,
    EvaModule,
    SocketIoModule,
  ],
  providers: [
    AuthService,
    RouteActivator,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
