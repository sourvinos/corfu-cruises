import { Component } from '@angular/core'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'

@Component({
    selector: 'logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.css']
})

export class LogoComponent {

    //#region variables

    public companyLogoImagePathname: any
    public companyLogoText: any

    //#endregion

    constructor(private helperService: HelperService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.updateLogoImage()
    }

    //#endregion

    //#region private methods

    private updateLogoImage(): void {
        this.companyLogoText = this.helperService.getApplicationTitle()
        this.companyLogoImagePathname = '/assets/images/icons/logo.svg'
    }

    //#endregion

}
