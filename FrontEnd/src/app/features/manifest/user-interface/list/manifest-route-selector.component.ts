import { Component, Inject, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { FieldsetCriteriaService } from 'src/app/shared/services/fieldset-criteria.service'
import { LocalStorageService } from './../../../../shared/services/local-storage.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { ShipRouteActiveVM } from './../../../shipRoutes/classes/view-models/shipRoute-active-vm'
// Custom

@Component({
    selector: 'manifest-route-selector',
    templateUrl: './manifest-route-selector.component.html',
    styleUrls: ['../../../../../assets/styles/dialogs.css', './manifest-route-selector.component.css']
})

export class ManifestRouteSelectorComponent {

    //#region variables

    private criteria: ShipRouteActiveVM
    private feature = 'manifestCriteria'
    public form: FormGroup
    public shipRoutes: ShipRouteActiveVM[] = []

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ManifestRouteSelectorComponent>, private emojiService: EmojiService, private fieldsetCriteriaService: FieldsetCriteriaService, private formBuilder: FormBuilder, private localStorageService: LocalStorageService, private messageLabelService: MessageLabelService, private ngZone: NgZone) { }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.initForm()
        this.populateDropdowns()
    }

    //#endregion

    //#region public methods

    public close(): void {
        this.dialogRef.close()
    }

    public continue(): void {
        this.ngZone.run(() => {
            const x = JSON.parse(this.localStorageService.getItem('shipRoutes'))
            const z = x.find(z => z.id == this.form.value.shipRoutes[0].id)
            this.dialogRef.close(z)
        })
    }

    public filterList(event: { target: { value: any } }, list: string | number): void {
        this.fieldsetCriteriaService.filterList(event.target.value, this[list])
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public lookup(array: string, arrayId: number): boolean {
        if (this.criteria) {
            return this.criteria[array].filter((x: { id: number }) => x.id == arrayId).length != 0 ? true : false
        }
    }

    public updateRadioButtons(form: FormGroup, classname: any, idName: any, id: any, description: any): void {
        this.fieldsetCriteriaService.updateRadioButtons(form, classname, idName, id, description)
    }

    //#endregion

    //#region private methods

    private initForm(): void {
        this.form = this.formBuilder.group({
            shipRoutes: this.formBuilder.array([], Validators.required),
            shipRoutesFilter: '',
            allShipRoutesCheckbox: ''
        })
    }

    private populateDropdownFromLocalStorage(table: string): void {
        this[table] = JSON.parse(this.localStorageService.getItem(table))
    }

    private populateDropdowns(): void {
        this.populateDropdownFromLocalStorage('shipRoutes')
    }

    //#endregion

}
