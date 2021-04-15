// Base
import { Component, HostListener } from '@angular/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
// Custom
import { AccountService } from '../shared/services/account.service'

@Component({
    selector: 'root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {

    //#region variables

    public showLoadingIndication = true

    //#endregion

    constructor(private accountService: AccountService, private router: Router) {
        this.router.events.subscribe((routerEvent) => {
            if (routerEvent instanceof NavigationStart) {
                this.showLoadingIndication = true
            }
            if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
                this.showLoadingIndication = false
            }
        })
    }

    @HostListener('window:resize', ['$event']) onResize(): any {
        this.positionSpinner()
    }

    @HostListener('window:beforeunload', ['$event']) beforeUnloadHander(): any {
        this.accountService.logout()
    }

    //#region lifecycle hooks

    ngAfterViewInit(): void {
        this.positionSpinner()
    }

    //#endregion

    //#region private methods

    private positionSpinner(): void {
        document.getElementById('spinner').style.left = (document.getElementById('main').clientWidth / 2) - (document.getElementById('spinner').clientWidth) + document.getElementById('side-bar').clientWidth + 'px'
        document.getElementById('spinner').style.top = (document.getElementById('main').clientHeight / 2) - (document.getElementById('spinner').clientHeight / 2) + 'px'
    }

    //#endregion

}
