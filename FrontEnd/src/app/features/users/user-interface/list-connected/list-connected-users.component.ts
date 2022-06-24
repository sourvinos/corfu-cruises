import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
// Custom
import { slideFromRight, slideFromLeft } from 'src/app/shared/animations/animations'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'
import { SnackbarService } from 'src/app/shared/services/snackbar.service'
import { UserService } from '../../classes/services/user.service'

@Component({
    selector: 'list-connected-users',
    templateUrl: './list-connected-users.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './list-connected-users.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class ListConnectedUsersComponent {

    public icon = 'arrow_back'
    public parentUrl = null
    public feature = 'connectedUserList'
    public records = []

    constructor(private activatedRoute: ActivatedRoute,private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService, private snackbarService: SnackbarService, private userService: UserService) { }

    ngOnInit(): void {
        this.getConnectedUsers()
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    private getConnectedUsers(): void {
        this.userService.getConnectedUsers().subscribe(response => {
            this.records = response
            console.log(this.records)
        })
    }

    private showSnackbar(message: string, type: string): void {
        this.snackbarService.open(message, type)
    }


}
