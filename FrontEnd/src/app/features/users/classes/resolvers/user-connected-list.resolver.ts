import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ListResolved } from 'src/app/shared/classes/list-resolved'
import { UserService } from '../services/user.service'

@Injectable({ providedIn: 'root' })

export class UserConnectedListResolver {

    constructor(private userService: UserService) { }

    resolve(): Observable<ListResolved> {
        return this.userService.getConnectedUsers()
            .pipe(
                map((userList) => new ListResolved(userList)),
                catchError((err) => of(new ListResolved(null, err)))
            )
    }

}
