import { NgModule } from '@angular/core'

import { ChangePasswordFormComponent } from '../user-interface/change-password-form.component'
import { EditUserFormComponent } from '../user-interface/edit-user-form.component'
import { MaterialModule } from '../../../shared/modules/material.module'
import { RegisterUserFormComponent } from '../user-interface/register-user-form.component'
import { SharedModule } from '../../../shared/modules/shared.module'
import { UserListComponent } from '../user-interface/user-list.component'
import { UserRoutingModule } from './user.routing.module'

@NgModule({
    declarations: [
        RegisterUserFormComponent,
        EditUserFormComponent,
        UserListComponent,
        ChangePasswordFormComponent,
    ],
    imports: [
        SharedModule,
        MaterialModule,
        UserRoutingModule
    ]
})

export class UserModule { }
