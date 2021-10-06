import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { ForgotPasswordFormComponent } from '../user-interface/forgot-password-form.component'
import { ResetPasswordFormComponent } from '../user-interface/reset-password-form.component'

const routes: Routes = [
    { path: 'forgotPassword', component: ForgotPasswordFormComponent },
    { path: 'resetPassword', component: ResetPasswordFormComponent }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AccountRoutingModule { }