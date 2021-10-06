import { NgModule } from '@angular/core'
// Custom
import { AccountRoutingModule } from './account.routing.module'
import { ForgotPasswordFormComponent } from '../user-interface/forgot-password-form.component'
import { ResetPasswordFormComponent } from '../user-interface/reset-password-form.component'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ForgotPasswordFormComponent,
        ResetPasswordFormComponent
    ],
    imports: [
        SharedModule,
        AccountRoutingModule
    ]
})

export class AccountModule { }
