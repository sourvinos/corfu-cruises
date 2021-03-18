import { Component } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { HelperService } from '../../shared/services/helper.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent {

    //#region variables

    private windowTitle = 'Home'
    public companyLogo: any

    //#endregion

    constructor(private helperService: HelperService, private titleService: Title) { }

    //#region lifecyle hooks

    ngOnInit(): void {
        this.getAppName()
        this.setWindowTitle()
    }

    //#endregion

    //#region private methods

    private getAppName(): void {
        this.companyLogo = this.helperService.getApplicationTitle().split(' ')
    }

    private setWindowTitle(): void {
        this.titleService.setTitle(this.helperService.getApplicationTitle() + ' :: ' + this.windowTitle)
    }

    //#endregion

}
