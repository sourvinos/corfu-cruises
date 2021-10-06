import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
import { QRCodeModule } from 'angular2-qrcode'
// Custom
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { DisableToogleDirective } from '../directives/mat-slide-toggle.directive'
import { FormatNumberPipe } from '../pipes/format-number.pipe'
import { InputFormatDirective } from 'src/app/shared/directives/input-format.directive'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MapComponent } from '../components/map/map.component'
import { MaterialModule } from './material.module'
import { PrimeNgModule } from './primeng.module'
import { QRCodeComponent } from '../components/qrCode/qrCode.component'
import { SafeStylePipe } from '../pipes/safeStyle.pipe'
import { SnackbarComponent } from '../components/snackbar/snackbar.component'

@NgModule({
    declarations: [
        DialogAlertComponent,
        DisableToogleDirective,
        FormatNumberPipe,
        InputFormatDirective,
        InputTabStopDirective,
        MapComponent,
        QRCodeComponent,
        SafeStylePipe,
        SnackbarComponent,
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
        FormsModule,
        MaterialModule,
        PrimeNgModule,
        QRCodeModule,
        ZXingScannerModule,
        DisableToogleDirective,
        FormatNumberPipe,
        InputFormatDirective,
        InputTabStopDirective,
        MapComponent,
        QRCodeComponent,
        ReactiveFormsModule,
        RouterModule
    ],
    entryComponents: [
        DialogAlertComponent,
        SnackbarComponent
    ]
})

export class SharedModule { }
