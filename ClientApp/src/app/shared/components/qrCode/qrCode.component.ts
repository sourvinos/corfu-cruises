import { Component, Input } from '@angular/core'

@Component({
    selector: 'qrCode',
    templateUrl: './qrCode.component.html',
    styleUrls: ['./qrCode.component.css']
})

export class QRCodeComponent {

    @Input() qrCodeValue: string
    @Input() errorCorrectionLevel: 'M'
    @Input() margin: number
    @Input() width: number

}
