import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ZXingScannerModule } from '@zxing/ngx-scanner'
// Custom
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'
import { DisableToogleDirective } from '../directives/mat-slide-toggle.directive'
import { HomeButtonAndTitleComponent } from '../components/home-button-and-title/home-button-and-title.component'
import { InputTabStopDirective } from 'src/app/shared/directives/input-tabstop.directive'
import { LanguageMenuComponent } from '../components/top-bar-wrapper/language-menu/language-menu.component'
import { ListNoResultsComponent } from '../components/list-no-results/list-no-results.component'
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component'
import { LoginLogoComponent } from 'src/app/features/login/user-interface/login-logo.component'
import { MaterialModule } from './material.module'
import { ModalActionResultComponent } from '../components/modal-action-result/modal-action-result.component'
import { MonthSelectorComponent } from '../components/month-selector/month-selector.component'
import { PrimeNgModule } from './primeng.module'
import { SafeStylePipe } from '../pipes/safeStyle.pipe'
import { SnackbarComponent } from '../components/snackbar/snackbar.component'
import { TableTotalFilteredRecordsComponent } from '../components/table-total-filtered-records/table-total-filtered-records.component'
import { ThemeMenuComponent } from './../components/top-bar-wrapper/theme-menu/theme-menu.component'

@NgModule({
    declarations: [
        DialogAlertComponent,
        DisableToogleDirective,
        HomeButtonAndTitleComponent,
        InputTabStopDirective,
        LanguageMenuComponent,
        ListNoResultsComponent,
        LoadingSpinnerComponent,
        LoginLogoComponent,
        ModalActionResultComponent,
        MonthSelectorComponent,
        SafeStylePipe,
        SnackbarComponent,
        TableTotalFilteredRecordsComponent,
        ThemeMenuComponent
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
        LanguageMenuComponent,
        ListNoResultsComponent,
        LoadingSpinnerComponent,
        LoginLogoComponent,
        MaterialModule,
        MonthSelectorComponent,
        PrimeNgModule,
        ReactiveFormsModule,
        RouterModule,
        TableTotalFilteredRecordsComponent,
        ThemeMenuComponent,
        ZXingScannerModule
    ],
    entryComponents: [
        DialogAlertComponent,
        ModalActionResultComponent,
        SnackbarComponent
    ]
})

export class SharedModule { }
