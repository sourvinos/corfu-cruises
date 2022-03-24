import { Component } from '@angular/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
// Custom
import { HelperService } from 'src/app/shared/services/helper.service'
import { InteractionService } from 'src/app/shared/services/interaction.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'

@Component({
    selector: 'logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.css']
})

export class LogoComponent {

    //#region variables

    private ngunsubscribe = new Subject<void>()
    public companyLogoImagePathname: any
    public companyLogoText: any

    //#endregion

    constructor(private helperService: HelperService, private interactionService: InteractionService, private localStorageService: LocalStorageService) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.updateCompanyLogo()
        this.subscribeToInteractionService()
    }

    //#endregion

    //#region private methods

    private refreshLogo(): void {
        this.interactionService.mustRefreshLogo()
    }

    private subscribeToInteractionService(): void {
        this.interactionService.refreshLogo.pipe(takeUntil(this.ngunsubscribe)).subscribe(() => {
            this.updateCompanyLogo()
        })
    }

    private updateCompanyLogo(): void {
        this.companyLogoText = this.helperService.getApplicationTitle()
        this.companyLogoImagePathname = '/assets/images/icons/logo-' + this.localStorageService.getItem('theme') + '.png'
    }

    //#endregion

}
