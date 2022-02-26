import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
// Custom
import { AccountService } from './../../../services/account.service'
import { MessageLabelService } from './../../../services/messages-label.service'
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'search-byRef-box',
    templateUrl: './search-byRef-box.component.html',
    styleUrls: ['./search-byRef-box.component.css'],
})

export class SearchByRefBoxComponent {

    //#region variables

    public loginStatus: Observable<boolean>
    private feature = 'searchByRefBox'
    public form: FormGroup

    //#endregion

    constructor(private accountService: AccountService, private formBuilder: FormBuilder, private messageLabelService: MessageLabelService, private router: Router) { }

    //#region lifecycle hooks

    ngOnInit() {
        this.initForm()
    }

    ngDoCheck(): void {
        this.updateVariables()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onSearchByRefNo() {
        this.router.navigate(['reservations/byRefNo', this.form.value.searchByRefNo])
    }

    //#endregion

    //#region private methods

    private initForm(): void {
        this.form = this.formBuilder.group({
            searchByRefNo: [''],
        })
    }

    private updateVariables(): void {
        this.loginStatus = this.accountService.isLoggedIn
    }

    //#endregion
}
