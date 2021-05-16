import { Component } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'
import { HelperService } from 'src/app/shared/services/helper.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'top-logo',
    templateUrl: './top-logo.component.html',
    styleUrls: ['./top-logo.component.css']
})

export class TopLogoComponent {

    //#region variables

    public companyLogo: any

    //#endregion

    constructor(private deviceDetectorService: DeviceDetectorService, private helperService: HelperService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.updateCompanyLogo()
        this.isDesktop()
    }

    //#endregion

    //#region public methods

    public isDesktop(): boolean {
        return this.deviceDetectorService.getDeviceInfo().deviceType == 'desktop'
    }

    public isNarrowScreen(): boolean {
        return this.helperService.getElementWidth(document.body) < environment.isWideScreen
    }

    //#endregion 

    //#region private methods

    private updateCompanyLogo(): void {
        this.companyLogo = this.helperService.getApplicationTitle().split(' ')
    }

    //#endregion

}
