import { Component } from '@angular/core'
import { Router } from '@angular/router'
// Custom
import { AccountService } from 'src/app/shared/services/account.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { slideFromLeft, slideFromRight } from 'src/app/shared/animations/animations'

@Component({
    selector: 'my-account',
    templateUrl: './myAccount.component.html',
    styleUrls: ['../../../../../assets/styles/forms.css', './myAccount.component.css'],
    animations: [slideFromLeft, slideFromRight]
})

export class MyAccountComponent {

    public feature = 'myAccount'
    public icon = 'home'
    private url = 'users'
    public parentUrl = '/'

    constructor(private accountService: AccountService, private messageLabelService: MessageLabelService, private router: Router) { }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onChangePassword(): void {
        this.accountService.getConnectedUserId().subscribe(response => {
            this.router.navigate(['/users/' + response.userId + '/changePassword'])
        })
    }

    public onEdit(): void {
        this.accountService.getConnectedUserId().subscribe(response => {
            this.router.navigate([this.url, response.userId])
        })
    }

}