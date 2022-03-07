import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { QRCodeModule } from 'angular2-qrcode'
import { RouterModule } from '@angular/router'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
// Custom
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { DisableToogleDirective } from '../directives/mat-slide-toggle.directive'
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
        InputFormatDirective,
        InputTabStopDirective,
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
        InputFormatDirective,
        InputTabStopDirective,
        MapComponent,
        MaterialModule,
        PrimeNgModule,
        QRCodeComponent,
        QRCodeModule,
        ReactiveFormsModule,
        RouterModule,
        ZXingScannerModule,
    ],
    entryComponents: [
        DialogAlertComponent,
        SnackbarComponent
    ]
})

export class SharedModule { }
