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

    constructor(private router: Router, private accountService: AccountService) {
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

    //#region public methods

    public onHideMenu(): void {
        const menu = (<HTMLElement>document.getElementById('hamburger-menu')); menu.classList.remove('visible')
        const nav = (<HTMLElement>document.getElementById('secondary-menu')); nav.classList.remove('visible')
    }

    //#endregion

    //#region private methods

    private getSidebarWidth(): number {
        if (document.body.contains(document.getElementById('side-bar'))) {
            return document.getElementById('side-bar').clientWidth
        }
        return 0
    }

    private positionSpinner(): void {
        document.getElementById('spinner').style.left = (window.outerWidth / 2) - 40 + 'px'
        document.getElementById('spinner').style.top = (document.getElementById('wrapper').clientHeight / 2) - 40 + 'px'
    }

    //#endregion

}
