import { Component, HostListener } from '@angular/core'
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router'
// Custom
import { AccountService } from '../shared/services/account.service'
import { HelperService } from '../shared/services/helper.service'

@Component({
    selector: 'root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {

    //#region variables

    public showLoadingIndication = true

    //#endregion

    constructor(private helperService: HelperService, private router: Router, private accountService: AccountService) {
        this.router.events.subscribe((routerEvent) => {
            if (routerEvent instanceof NavigationStart) {
                this.showLoadingIndication = true
            }
            if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
                this.showLoadingIndication = false
            }
        })
    }

    //#region listeners

    @HostListener('window:resize', ['$event']) onResize(): any {
        this.positionSpinner()
    }

    @HostListener('window:beforeunload', ['$event']) beforeUnloadHander(): any {
        this.accountService.logout()
    }

    @HostListener('click', ['$event']) onClick(event): void {
        if (event.target.id == 'closeSearchBox' || event.target.className == 'mat-button-wrapper' || event.target.closest('#searchBox') == null) {
            if (this.helperService.findElementById('searchBox')) {
                document.getElementById('searchBox').classList.remove('open')
                document.getElementById('search-icon').classList.remove('hidden')
            }
        }
    }

    //#endregion

    //#region lifecycle hooks

    ngAfterViewInit(): void {
        this.positionSpinner()
    }

    //#endregion

    //#region private methods

    private positionSpinner(): void {
        document.getElementById('spinner').style.left = (window.outerWidth / 2) - 40 + 'px'
        document.getElementById('spinner').style.top = (document.getElementById('wrapper').clientHeight / 2) - 40 + 'px'
    }

    //#endregion

}
