import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    //#region public methods

    public createJsonFile(data: any): void {
        const theJSON = JSON.stringify(data)
        const uri = "data:application/json;charset=UTF-8," + encodeURIComponent(theJSON)
        const a = document.createElement('a')
        a.href = uri
        a.innerHTML = "Right-click and choose 'save as...'"
        document.body.appendChild(a)
    }

    public getApplicationTitle(): any {
        return this.appName
    }

    public setFocus(element: string): void {
        setTimeout(() => {
            const input = <HTMLInputElement>document.getElementById(element)
            input.focus()
            input.select()
        }, 500)
    }

    public saveItem(key: string, value: string): void {
        localStorage.setItem(key, value)
    }

    public readItem(item: string): string {
        return localStorage.getItem(item) || ''
    }

    public convertMonthStringToNumber(month: string): number {
        switch (month) {
            case 'JAN': case 'LED': case 'JAN.': case 'ΙΑΝ':
                return 1
            case 'FEB': case 'ÚNO': case 'FEB.': case 'ΦΕΒ':
                return 2
            case 'MAR': case 'BŘE': case 'ΜΑΡ': case 'MÄRZ':
                return 3
            case 'APR': case 'DUB': case 'APR.': case 'ΑΠΡ':
                return 4
            case 'MAY': case 'KVĚ': case 'ΜΑΪ': case 'MAI':
                return 5
            case 'JUN': case 'ČVN': case 'JUNI': case 'ΙΟΥΝ':
                return 6
            case 'JUL': case 'ČVC': case 'JULI': case 'ΙΟΥΛ':
                return 7
            case 'AUG': case 'SRP': case 'AUG.': case 'ΑΥΓ':
                return 8
            case 'SEP': case 'ZÁŘ': case 'SEP.': case 'ΣΕΠ':
                return 9
            case 'OCT': case 'ŘÍJ': case 'OKT.': case 'OKT':
                return 10
            case 'NOV': case 'LIS': case 'NOV.': case 'ΝΟΕ':
                return 11
            case 'DEC': case 'PRO': case 'DEZ.': case 'ΔΕΚ':
                return 12
        }
    }


    //#endregion

}
