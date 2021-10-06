import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'
import { UserService } from './user.service'

@Injectable({ providedIn: 'root' })

export class UserFormResolver {

    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const response = this.userService.getSingle(route.params.id)
        if (response)
            response.subscribe(() => {
                return response
            })
    }

}
