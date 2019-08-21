import { NgModule } from '@angular/core'
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'
import { WelcomeComponent } from './welcome/welcome.component'
import { RouteActivator } from './shared/route-activator.service'

const routes: Routes = [
  { path: 'home', component: WelcomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  {
    path: 'hani',
    canActivate: [RouteActivator],
    data: {minRole: 5},
    loadChildren: () => import('./hani/hani.module').then(m => m.HaniModule)
  },
  {
    path: 'alerts',
    canActivate: [RouteActivator],
    data: {minRole: 5},
    loadChildren: () => import('./cher/cher.module').then(m => m.CherModule)
  },
  {
    path: 'eva',
    canActivate: [RouteActivator],
    data: {minRole: 4},
    loadChildren: () => import('./eva/eva.module').then(m => m.EvaModule)
  },
  {
    path: 'eva',
    canActivate: [RouteActivator],
    data: {minRole: 4},
    loadChildren: () => import('./eva/eva.module').then(m => m.EvaModule)
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
