import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
// Custom
import { UserService } from '../services/user.service'

@Injectable({ providedIn: 'root' })

export class UserFormResolver {

    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.userService.getSingle(route.params.id)
    }

}
