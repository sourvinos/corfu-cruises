import { Component, Inject, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { HelperService } from '../../services/helper.service'
import { LocalStorageService } from 'src/app/shared/services/local-storage.service'
import { MessageHintService } from '../../services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ValidationService } from './../../services/validation.service'

@Component({
    selector: 'active-year-dialog',
    templateUrl: './active-year-dialog.component.html',
    styleUrls: ['../../../../assets/styles/dialogs.css', './active-year-dialog.component.css']
})

export class ActiveYearDialogComponent {

    //#region variables

    public form: FormGroup
    private feature = 'activeYear'

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ActiveYearDialogComponent>, private formBuilder: FormBuilder, private helperService: HelperService, private localStorageService: LocalStorageService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private ngZone: NgZone) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateFieldFromStorage()
        this.focusFirstField()
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public onClose(): void {
        this.dialogRef.close()
    }

    public onSave(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.form.getRawValue().activeYear)
        })
    }

    public getHint(id: string, minmax = 0): string {
        return this.messageHintService.getDescription(id, minmax)
    }


    //#endregion

    //#region private methods

    private populateFieldFromStorage(): void {
        this.form.setValue({
            activeYear: this.localStorageService.getItem('year')
        })
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            activeYear: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), ValidationService.isNumber]]
        })
    }

    //#endregion

    get activeYear(): AbstractControl {
        return this.form.get('activeYear')
    }

    private focusFirstField(): void {
        this.helperService.focusOnField('activeYear')
    }

}
