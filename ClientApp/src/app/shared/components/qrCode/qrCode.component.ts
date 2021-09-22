import { Component, Input } from '@angular/core'

@Component({
    selector: 'qr-Code',
    templateUrl: './qrCode.component.html',
    styleUrls: ['./qrCode.component.css']
})

export class QRCodeComponent {

    @Input() value: string
    @Input() size: number
    @Input() level: string

}
