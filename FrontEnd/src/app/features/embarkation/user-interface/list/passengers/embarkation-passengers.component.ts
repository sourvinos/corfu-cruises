import { Component, Inject, NgZone } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Subject } from 'rxjs'
import { indicate } from 'src/app/shared/services/helper.service'
// Custom
import { EmbarkationPassengerVM } from '../../../classes/view-models/list/embarkation-passenger-vm'
import { EmbarkationService } from '../../../classes/services/embarkation.service'
import { EmojiService } from './../../../../../shared/services/emoji.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { environment } from 'src/environments/environment'
import { TempPassengerVM } from '../../../classes/view-models/list/temp-passenger-vm'

@Component({
    selector: 'embarkation-passengers',
    templateUrl: './embarkation-passengers.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css', './embarkation-passengers.component.css']
})

export class EmbarkationPassengerListComponent {

    //#region variables

    private feature = 'embarkationList'
    private tempPassengers: TempPassengerVM[] = []
    public passengers: EmbarkationPassengerVM[]
    public isLoading = new Subject<boolean>()

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<EmbarkationPassengerListComponent>, private embarkationService: EmbarkationService, private emojiService: EmojiService, private messageLabelService: MessageLabelService, private ngZone: NgZone) {
        this.passengers = data.passengers
        console.log(data.passengers)
    }

    ngOnInit(): void {
        this.data.passengers.forEach((passenger: { id: any; isCheckedIn: any }) => {
            this.tempPassengers.push({
                id: passenger.id,
                isCheckedIn: passenger.isCheckedIn
            })
        })
        console.log('Init', this.tempPassengers)
    }

    //#region public methods

    public close(): void {
        this.ngZone.run(() => {
            this.dialogRef.close(this.passengers)
        })
    }

    public doEmbarkation(ignoreCurrentStatus: boolean, passengers: EmbarkationPassengerVM[]): void {
        const ids: number[] = []
        passengers.forEach(passenger => {
            ids.push(passenger.id)
        })
        this.embarkationService.embarkPassengers(ignoreCurrentStatus, ids).pipe(indicate(this.isLoading)).subscribe({
            complete: () => {
                passengers.forEach(passenger => {
                    const z = this.passengers.find(x => x.id == passenger.id)
                    if (ignoreCurrentStatus == false) {
                        z.isCheckedIn = !z.isCheckedIn
                    }
                })
            }
        })
    }

    public toggleEmbarkationStatus(passenger: EmbarkationPassengerVM): void {
        const passengers: EmbarkationPassengerVM[] = []
        passengers.push(passenger)
        this.doEmbarkation(false, passengers)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public getNationalityIcon(nationalityCode: string): any {
        return environment.nationalitiesIconDirectory + nationalityCode.toLowerCase() + '.png'
    }

    public enableAll(): boolean {
        const z = this.passengers.filter(x => x.isCheckedIn == false)
        return z.length == 0
    }

    //#endregion

}
