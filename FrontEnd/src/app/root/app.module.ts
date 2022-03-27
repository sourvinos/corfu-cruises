// Base
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ScrollingModule } from '@angular/cdk/scrolling'
// Modules
import { AppRoutingModule } from './app.routing.module'
import { LoginModule } from '../features/login/classes/login.module'
import { NgIdleModule } from '@ng-idle/core'
import { PrimeNgModule } from '../shared/modules/primeng.module'
// Components
import { AppComponent } from './app.component'
import { LogoComponent } from '../shared/components/top-bar-wrapper/logo/logo.component'
import { SearchByRefBoxComponent } from '../shared/components/top-bar-wrapper/search-byRef-box/search-byRef-box.component'
import { ThemeMenuComponent } from '../shared/components/top-bar-wrapper/theme-menu/theme-menu.component'
import { TopBarComponent } from '../shared/components/top-bar-wrapper/top-bar/top-bar.component'
import { TopMenuComponent } from '../shared/components/top-bar-wrapper/top-menu/top-menu.component'
// Utils
import { JwtInterceptor } from '../shared/services/jwt.interceptor'
import { MainMenuComponent } from '../shared/components/main-menu/main-menu/main-menu.component'

@NgModule({
    declarations: [
        AppComponent,
        LogoComponent,
        SearchByRefBoxComponent,
        MainMenuComponent,
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
        NgIdleModule.forRoot(),
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
