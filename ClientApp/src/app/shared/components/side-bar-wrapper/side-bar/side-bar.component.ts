import { HelperService } from 'src/app/shared/services/helper.service';
import { Component } from '@angular/core'
import { DeviceDetectorService } from 'ngx-device-detector'

@Component({
    selector: 'side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css']
})

export class SideBarComponent {

    constructor(private deviceDetectorService: DeviceDetectorService, private helperService: HelperService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.isDesktop()
    }

    //#endregion

    //#region public methods


    public isFakeDesktop(): boolean {
        return this.helperService.deviceDetector() == 'desktop'
    }

    public isDesktop(): boolean {
        return this.deviceDetectorService.getDeviceInfo().deviceType == 'desktop'
    }

    //#endregion

}
