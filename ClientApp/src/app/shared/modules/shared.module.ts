import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
// Custom
import { CustomTableComponent } from '../components/table/custom-table.component'
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { DialogIndexComponent } from '../components/dialog-index/dialog-index.component'
import { FormatNumberPipe } from '../pipes/format-number.pipe'
import { InputFormatDirective } from 'src/app/shared/directives/input-format.directive'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { MapComponent } from '../components/map/map.component'
import { MaterialModule } from './material.module'
import { PrimeNgModule } from './primeng.module'
import { QRCodeComponent } from '../components/qrCode/qrCode.component'
import { QRCodeModule } from 'angularx-qrcode'
import { SafeStylePipe } from '../pipes/safeStyle.pipe'
import { SnackbarComponent } from '../components/snackbar/snackbar.component'
import { NgQrScannerModule } from 'angular2-qrscanner'

@NgModule({
    declarations: [
        CustomTableComponent,
        DialogAlertComponent,
        DialogIndexComponent,
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
        CustomTableComponent,
        FormatNumberPipe,
        FormsModule,
        InputFormatDirective,
        InputTabStopDirective,
        MapComponent,
        MaterialModule,
        NgQrScannerModule,
        PrimeNgModule,
        QRCodeComponent,
        ReactiveFormsModule,
        RouterModule
        // ZXingScannerModule
    ],
    entryComponents: [
        DialogAlertComponent,
        DialogIndexComponent,
        SnackbarComponent
    ]
})

export class SharedModule { }
