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
import { BoardingModule } from '../features/boardings/classes/modules/boarding.module'
import { CrewModule } from '../features/ships/crews/classes/crew.module'
import { CustomerModule } from '../features/customers/classes/customer.module'
import { DestinationModule } from '../features/destinations/classes/destination.module'
import { DriverModule } from '../features/drivers/classes/driver.module'
import { GenderModule } from '../features/genders/classes/gender.module'
import { InvoicingModule } from '../features/invoicing/classes/modules/invoicing.module'
import { LoginModule } from '../features/login/classes/login.module'
import { ManifestModule } from '../features/manifest/classes/modules/manifest.module'
import { NationalityModule } from '../features/nationalities/classes/nationality.module'
import { PickupPointModule } from '../features/pickupPoints/classes/pickupPoint.module'
import { PortModule } from '../features/ports/classes/port.module'
import { PrimeNgModule } from '../shared/modules/primeng.module'
import { RegistrarModule } from '../features/ships/registrars/classes/registrar.module'
import { ReservationModule } from '../features/reservations/classes/modules/reservation.module'
import { RouteModule } from '../features/routes/classes/route.module'
import { ScheduleModule } from '../features/schedules/classes/schedule.module'
import { ShipModule } from '../features/ships/base/classes/ship.module'
import { ShipOwnerModule } from './../features/ships/owners/classes/ship-owner.module'
import { ShipRouteModule } from '../features/ships/routes/classes/shipRoute.module'
import { UserIdleModule } from 'angular-user-idle'
import { UserModule } from '../features/users/classes/user.module'
import { WebModule } from './../features/web/classes/modules/web.module'

// Components
import { AppComponent } from './app.component'
import { CreditsComponent } from '../features/credits/user-interface/credits.component'
import { EmptyPageComponent } from '../shared/components/empty-page/empty-page.component'
import { HomeComponent } from '../features/home/home.component'
import { LogoComponent } from '../shared/components/top-bar-wrapper/logo/logo.component'
import { SideBarComponent } from '../shared/components/side-bar-wrapper/side-bar/side-bar.component'
import { SideMenuComponent } from '../shared/components/side-bar-wrapper/side-menu/side-menu.component'
import { ThemeMenuComponent } from '../shared/components/top-bar-wrapper/theme-menu/theme-menu.component'
import { TopBarComponent } from '../shared/components/top-bar-wrapper/top-bar/top-bar.component'
import { TopMenuComponent } from '../shared/components/top-bar-wrapper/top-menu/top-menu.component'

// Utils
import { DomChangeDirective } from '../shared/directives/dom-change.directive'
import { JwtInterceptor } from '../shared/services/jwt.interceptor';


@NgModule({
    declarations: [
        AppComponent,
        CreditsComponent,
        DomChangeDirective,
        EmptyPageComponent,
        HomeComponent,
        LogoComponent,
        SideBarComponent,
        SideMenuComponent,
        ThemeMenuComponent,
        TopBarComponent,
        TopMenuComponent,
    ],
    imports: [
        AccountModule,
        AppRoutingModule,
        BoardingModule,
        BrowserAnimationsModule,
        BrowserModule,
        CrewModule,
        CustomerModule,
        DestinationModule,
        DriverModule,
        FormsModule,
        GenderModule,
        HttpClientModule,
        InvoicingModule,
        LoginModule,
        ManifestModule,
        NationalityModule,
        PickupPointModule,
        PortModule,
        PrimeNgModule,
        ReactiveFormsModule,
        RegistrarModule,
        ReservationModule,
        RouteModule,
        ScheduleModule,
        ScrollingModule,
        ShipModule,
        ShipOwnerModule,
        ShipRouteModule,
        UserModule,
        WebModule,
        UserIdleModule.forRoot({ idle: 3600, timeout: 60, ping: 60 })
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
