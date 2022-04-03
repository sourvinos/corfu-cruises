import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { QRCodeModule } from 'angular2-qrcode'
import { RouterModule } from '@angular/router'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
// Custom
import { CalendarScheduleComponent } from 'src/app/features/calendar/user-interface/calendar-schedule.component'
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { DisableToogleDirective } from '../directives/mat-slide-toggle.directive'
import { HomeButtonAndTitleComponent } from '../components/home-button-and-title/home-button-and-title.component'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { ListNoResultsComponent } from '../components/list-no-results/list-no-results.component'
import { MapComponent } from '../components/map/map.component'
import { MaterialModule } from './material.module'
import { PrimeNgModule } from './primeng.module'
import { QRCodeComponent } from '../components/qrCode/qrCode.component'
import { SafeStylePipe } from '../pipes/safeStyle.pipe'
import { SnackbarComponent } from '../components/snackbar/snackbar.component'

@NgModule({
    declarations: [
        CalendarScheduleComponent,
        DialogAlertComponent,
        DisableToogleDirective,
        HomeButtonAndTitleComponent,
        InputTabStopDirective,
        ListNoResultsComponent,
        MapComponent,
        QRCodeComponent,
        SafeStylePipe,
        SnackbarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        PrimeNgModule,
        QRCodeModule,
        ZXingScannerModule
    ],
    exports: [
        CommonModule,
        DisableToogleDirective,
        FormsModule,
        HomeButtonAndTitleComponent,
        InputTabStopDirective,
        ListNoResultsComponent,
        MapComponent,
        MaterialModule,
        PrimeNgModule,
        QRCodeComponent,
        QRCodeModule,
        ReactiveFormsModule,
        RouterModule,
        ZXingScannerModule
    ],
    entryComponents: [
        DialogAlertComponent,
        SnackbarComponent
    ]
})

export class SharedModule { }
