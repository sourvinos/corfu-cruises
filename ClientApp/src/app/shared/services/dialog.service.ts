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

    public open(titleColor: string, message: string, actions: string[]): Observable<boolean> {
        this.response = this.dialog.open(DialogAlertComponent, {
            height: '300px',
            width: '550px',
            data: {
                titleColor: titleColor,
                message: message,
                actions: actions
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

    //#endregion

}
