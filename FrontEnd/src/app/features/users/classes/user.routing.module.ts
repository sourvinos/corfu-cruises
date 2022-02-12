import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
// Custom
import { AuthGuardService } from 'src/app/shared/services/auth-guard.service'
import { CanDeactivateGuard } from 'src/app/shared/services/can-deactivate-guard.service'
import { ChangePasswordFormComponent } from '../user-interface/change-password-form.component'
import { EditUserFormComponent } from '../user-interface/edit-user-form.component'
import { RegisterUserFormComponent } from '../user-interface/register-user-form.component'
import { UserFormResolver } from './user-form.resolver'
import { UserListComponent } from '../user-interface/user-list.component'
import { UserListResolver } from './user-list.resolver'

const routes: Routes = [
    { path: '', component: UserListComponent, canActivate: [AuthGuardService], resolve: { userList: UserListResolver } },
    { path: 'new', component: RegisterUserFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
    { path: 'edit', component: EditUserFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { userForm: UserFormResolver } },
    { path: ':id', component: EditUserFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard], resolve: { userForm: UserFormResolver } },
    { path: ':id/changePassword', component: ChangePasswordFormComponent, canActivate: [AuthGuardService], canDeactivate: [CanDeactivateGuard] },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserRoutingModule { }