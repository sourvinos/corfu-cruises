import { Component } from '@angular/core'
import { HelperService } from 'src/app/shared/services/helper.service'

@Component({
    selector: 'side-logo',
    templateUrl: './side-logo.component.html',
    styleUrls: ['./side-logo.component.css']
})

export class SideLogoComponent {

    public logo: any

    constructor(private helperService: HelperService) { }

    ngOnInit(): void {
        this.getAppName()
    }

    private getAppName(): void {
        this.logo = this.helperService.getApplicationTitle().split(' ')
    }

}
