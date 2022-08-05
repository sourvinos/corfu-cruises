import { Component } from '@angular/core'
// Custom
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'login-logo',
    templateUrl: './login-logo.component.html',
    styleUrls: ['../../../shared/styles/login-forgot-password-logo.css']
})

export class LoginLogoComponent {

    //#region variables

    public feature = 'loginForm'

    //#endregion

    constructor(private messageLabelService: MessageLabelService) { }

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

}
