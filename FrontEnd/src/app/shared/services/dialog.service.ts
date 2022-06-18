import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'

@Injectable({ providedIn: 'root' })

export class DialogService {

    //#region variables

    private response: any

    //#endregion

    constructor(public dialog: MatDialog) { }

    //#region public methods

    public open(message: string, iconStyle: string, actions: string[]): Observable<boolean> {
        this.response = this.dialog.open(DialogAlertComponent, {
            height: '30rem',
            width: '30rem',
            data: {
                message: message,
                iconStyle: iconStyle,
                actions: actions
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

    //#endregion

}
