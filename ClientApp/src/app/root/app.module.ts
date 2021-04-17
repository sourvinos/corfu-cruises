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
import { BoardingModule } from '../features/boardings/classes/boarding.module'
import { ReservationModule } from '../features/reservations/classes/modules/reservation.module'
import { CustomerModule } from '../features/customers/classes/customer.module'
import { DestinationModule } from '../features/destinations/classes/destination.module'
import { DriverModule } from '../features/drivers/classes/driver.module'
import { GenderModule } from '../features/genders/classes/gender.module'
import { LoginModule } from '../features/login/classes/login.module'
import { MaterialModule } from '../shared/modules/material.module'
import { PickupPointModule } from '../features/pickupPoints/classes/pickupPoint.module'
import { PortModule } from '../features/ports/classes/port.module'
import { RouteModule } from '../features/routes/classes/route.module'
import { ScheduleModule } from '../features/schedules/classes/schedule.module'
import { ShipModule } from '../features/ships/classes/ship.module'
import { UserIdleModule } from 'angular-user-idle'
import { UserModule } from '../features/users/classes/user.module'

// Components
import { AppComponent } from './app.component'
import { CreditsComponent } from '../features/credits/user-interface/credits.component'
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component'
import { HomeComponent } from '../features/home/home.component'
import { LanguageMenuComponent } from '../shared/components/top-bar-wrapper/language-menu/language-menu.component'
import { MainMenuComponent } from '../shared/components/top-bar-wrapper/main-menu/main-menu.component'
import { NationalityModule } from '../features/nationalities/classes/nationality.module'
import { ScheduleMenuComponent } from '../shared/components/top-bar-wrapper/schedule-menu/schedule-menu.component'
import { SideBarComponent } from '../shared/components/side-bar-wrapper/side-bar/side-bar.component'
import { SideFooterComponent } from './../shared/components/side-bar-wrapper/side-footer/side-footer.component'
import { SideImageComponent } from '../shared/components/side-bar-wrapper/side-image/side-image.component'
import { SideLogoComponent } from './../shared/components/side-bar-wrapper/side-logo/side-logo.component'
import { ThemeMenuComponent } from '../shared/components/top-bar-wrapper/theme-menu/theme-menu.component'
import { TopBarComponent } from '../shared/components/top-bar-wrapper/top-bar/top-bar.component'
import { TopLogoComponent } from '../shared/components/top-bar-wrapper/logo/top-logo.component'
import { UserMenuComponent } from '../shared/components/top-bar-wrapper/user-menu/user-menu.component'

// Utils
import { DomChangeDirective } from '../shared/directives/dom-change.directive'
import { JwtInterceptor } from '../shared/services/jwt.interceptor'

@NgModule({
    declarations: [
        AppComponent,
        CreditsComponent,
        DomChangeDirective,
        EmptyPageComponent,
        HomeComponent,
        LanguageMenuComponent,
        MainMenuComponent,
        ScheduleMenuComponent,
        SideBarComponent,
        SideFooterComponent,
        SideImageComponent,
        SideLogoComponent,
        ThemeMenuComponent,
        TopBarComponent,
        TopLogoComponent,
        UserMenuComponent,
    ],
    imports: [
        AccountModule,
        AppRoutingModule,
        BoardingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CustomerModule,
        DestinationModule,
        DriverModule,
        FormsModule,
        GenderModule,
        HttpClientModule,
        LoginModule,
        MaterialModule,
        NationalityModule,
        PickupPointModule,
        PortModule,
        ReactiveFormsModule,
        ReservationModule,
        RouteModule,
        ScheduleModule,
        ScrollingModule,
        ShipModule,
        UserModule,
        UserIdleModule.forRoot({ idle: 3600, timeout: 60, ping: 60 })
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
