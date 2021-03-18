import { NgModule } from '@angular/core'

import { AccountRoutingModule } from './account.routing.module'
import { ForgotPasswordFormComponent } from '../user-interface/forgot-password-form.component'
import { MaterialModule } from '../../../shared/modules/material.module'
import { ResetPasswordFormComponent } from '../user-interface/reset-password-form.component'
import { SharedModule } from '../../../shared/modules/shared.module'

@NgModule({
    declarations: [
        ForgotPasswordFormComponent,
        ResetPasswordFormComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        AccountRoutingModule
    ]
})

export class AccountModule { }
