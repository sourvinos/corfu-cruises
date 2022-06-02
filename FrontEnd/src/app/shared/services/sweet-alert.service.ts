import Swal from 'sweetalert2'
import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class SweetAlertService {

    public open(text: string, icon: any, showConfirmButton: boolean, showCancelButton: boolean, confirmButtonText: string, cancelButtonText: string, timer: number): void {
        Swal.fire({
            text: text,
            icon: icon,
            showConfirmButton: showConfirmButton,
            showCancelButton: showCancelButton,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            timer: timer,
            allowEnterKey: false
        })
    }

    private showError(message: string): void {
        this.open(message, 'error', true, false, 'OK', '', 0)
    }

    private showSuccess(message: string): void {
        this.open(message, 'success', true, false, 'OK', '', 0)
    }

}
