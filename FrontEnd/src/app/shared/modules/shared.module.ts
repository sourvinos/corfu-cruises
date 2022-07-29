import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
// Custom
import { AvailabilityComponent } from 'src/app/features/availability/user-interface/availability.component'
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { DisableToogleDirective } from '../directives/mat-slide-toggle.directive'
import { HomeButtonAndTitleComponent } from '../components/home-button-and-title/home-button-and-title.component'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { ListNoResultsComponent } from '../components/list-no-results/list-no-results.component'
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component'
import { MaterialModule } from './material.module'
import { ModalActionResultComponent } from '../components/modal-action-result/modal-action-result.component'
import { PrimeNgModule } from './primeng.module'
import { SafeStylePipe } from '../pipes/safeStyle.pipe'
import { SnackbarComponent } from '../components/snackbar/snackbar.component'

@NgModule({
    declarations: [
        AvailabilityComponent,
        DialogAlertComponent,
        DisableToogleDirective,
        HomeButtonAndTitleComponent,
        InputTabStopDirective,
        ListNoResultsComponent,
        LoadingSpinnerComponent,
        ModalActionResultComponent,
        SafeStylePipe,
        SnackbarComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        PrimeNgModule,
        ZXingScannerModule
    ],
    exports: [
        CommonModule,
        DisableToogleDirective,
        FormsModule,
        HomeButtonAndTitleComponent,
        InputTabStopDirective,
        ListNoResultsComponent,
        LoadingSpinnerComponent,
        MaterialModule,
        PrimeNgModule,
        ReactiveFormsModule,
        RouterModule,
        ZXingScannerModule
    ],
    entryComponents: [
        DialogAlertComponent,
        ModalActionResultComponent,
        SnackbarComponent
    ]
})

export class SharedModule { }
