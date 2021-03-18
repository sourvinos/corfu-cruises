import { Component, Input } from '@angular/core'

@Component({
    selector: 'qrCode',
    templateUrl: './qrCode.component.html',
    styleUrls: ['./qrCode.component.css']
})

export class QRCodeComponent {

    @Input() qrCodeValue: string
    @Input() errorCorrectionLevel: string
    @Input() margin: string
    @Input() width: string

}
