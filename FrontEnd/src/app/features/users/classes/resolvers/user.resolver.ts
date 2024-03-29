import { ActivatedRouteSnapshot } from '@angular/router'
import { Injectable } from '@angular/core'
import { catchError, map, of } from 'rxjs'
// Custom
import { FormResolved } from 'src/app/shared/classes/form-resolved'
import { UserService } from '../services/user.service'

@Injectable({ providedIn: 'root' })

export class UserResolver {

    constructor(private userService: UserService) { }

    resolve(route: ActivatedRouteSnapshot): any {
        return this.userService.getSingle(route.params.id).pipe(
            map((user) => new FormResolved(user)),
            catchError((err) => of(new FormResolved(null, err))))
    }

}
