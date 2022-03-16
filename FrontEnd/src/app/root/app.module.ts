// Base
import { NgModule } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ScrollingModule } from '@angular/cdk/scrolling'
// Modules
import { AppRoutingModule } from './app.routing.module'
import { LoginModule } from '../features/login/classes/login.module'
import { PrimeNgModule } from '../shared/modules/primeng.module'
// Components
import { AppComponent } from './app.component'
import { LogoComponent } from '../shared/components/top-bar-wrapper/logo/logo.component'
import { SearchByRefBoxComponent } from '../shared/components/top-bar-wrapper/search-byRef-box/search-byRef-box.component'
import { SideBarComponent } from '../shared/components/side-bar-wrapper/side-bar/side-bar.component'
import { SideMenuComponent } from '../shared/components/side-bar-wrapper/side-menu/side-menu.component'
import { ThemeMenuComponent } from '../shared/components/top-bar-wrapper/theme-menu/theme-menu.component'
import { TopBarComponent } from '../shared/components/top-bar-wrapper/top-bar/top-bar.component'
import { TopMenuComponent } from '../shared/components/top-bar-wrapper/top-menu/top-menu.component'
// Utils
import { JwtInterceptor } from '../shared/services/jwt.interceptor'

@NgModule({
    declarations: [
        AppComponent,
        LogoComponent,
        SearchByRefBoxComponent,
        SideBarComponent,
        SideMenuComponent,
        ThemeMenuComponent,
        TopBarComponent,
        TopMenuComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        LoginModule,
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
