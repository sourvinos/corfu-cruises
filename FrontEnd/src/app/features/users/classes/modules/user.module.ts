import { NgModule } from '@angular/core'
// Custom
import { ChangePasswordFormComponent } from '../../user-interface/change-password/change-password-form.component'
import { EditUserFormComponent } from '../../user-interface/edit/edit-user-form.component'
import { RegisterUserFormComponent } from '../../user-interface/register/register-user-form.component'
import { SharedModule } from '../../../../shared/modules/shared.module'
import { UserListComponent } from '../../user-interface/list/user-list.component'
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
        UserRoutingModule
    ]
})

export class UserModule { }
