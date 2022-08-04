import { Component } from '@angular/core'
// Custom
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'login-logo',
    templateUrl: './login-logo.component.html',
    styleUrls: ['./login-logo.component.css']
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
