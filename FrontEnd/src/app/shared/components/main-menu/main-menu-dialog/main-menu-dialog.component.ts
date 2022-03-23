import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { MessageMenuService } from 'src/app/shared/services/messages-menu.service'

@Component({
    selector: 'dialog-data-example-dialog',
    templateUrl: 'main-menu-dialog.component.html',
    styleUrls: ['./main-menu-dialog.component.css']
})

export class MainMenuDialog {

    public menuItems: [] = []

    constructor(private messageMenuService: MessageMenuService, private router: Router, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<MainMenuDialog>) { }

    ngOnInit(): void {
        this.messageMenuService.getMessages().then((response) => {
            this.buildMenu(response)
        })
    }

    public navigateToFeature(feature: string): void {
        this.router.navigate([feature])
        this.dialogRef.close()
    }

    public getLabel(id: string): string {
        return this.messageMenuService.getDescription(this.menuItems, id)
    }

    private buildMenu(response: any): void {
        this.menuItems = response
    }

}