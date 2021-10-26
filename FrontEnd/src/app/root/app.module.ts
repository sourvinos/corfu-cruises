// Base
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app.routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ScrollingModule } from '@angular/cdk/scrolling'

// Modules
import { AccountModule } from '../features/account/classes/account.module'
import { PrimeNgModule } from '../shared/modules/primeng.module'

// Components
import { AppComponent } from './app.component'
import { LogoComponent } from '../shared/components/top-bar-wrapper/logo/logo.component'
import { SideBarComponent } from '../shared/components/side-bar-wrapper/side-bar/side-bar.component'
import { SideMenuComponent } from '../shared/components/side-bar-wrapper/side-menu/side-menu.component'
import { ThemeMenuComponent } from '../shared/components/top-bar-wrapper/theme-menu/theme-menu.component'
import { TopBarComponent } from '../shared/components/top-bar-wrapper/top-bar/top-bar.component'
import { TopMenuComponent } from '../shared/components/top-bar-wrapper/top-menu/top-menu.component'

// Utils
import { DomChangeDirective } from '../shared/directives/dom-change.directive'
import { JwtInterceptor } from '../shared/services/jwt.interceptor'
import { LoginModule } from '../features/login/classes/login.module'

@NgModule({
    declarations: [
        AppComponent,
        DomChangeDirective,
        LogoComponent,
        SideBarComponent,
        SideMenuComponent,
        ThemeMenuComponent,
        TopBarComponent,
        TopMenuComponent
    ],
    imports: [
        AccountModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        LoginModule,
        FormsModule,
        HttpClientModule,
        PrimeNgModule,
        ReactiveFormsModule,
        ScrollingModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
