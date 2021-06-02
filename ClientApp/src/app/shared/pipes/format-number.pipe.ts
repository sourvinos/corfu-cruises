import { Pipe, PipeTransform } from '@angular/core'
import { HelperService } from '../services/helper.service'

@Pipe({ name: 'formatNumber' })

export class FormatNumberPipe implements PipeTransform {

    //#region variables

    private language = ''
    private seperators = []
    private regEx = /(\d)(?=(\d{3})+(?!\d))/g

    //#endregion

    constructor(private helperService: HelperService) {
        this.language = this.getLanguage()
        this.seperators = this.setSeperators()
    }

    //#region public methods

    public transform(value: number, fractionDigits = 0, addSymbol = false): string {
        switch (true) {
            case (value == 0):
                return value.toFixed(fractionDigits)
                    .replace(this.seperators[0], this.seperators[1])
                    .replace(this.regEx, '$1' + this.seperators[0]) + (addSymbol ? '% ––' : '')
            case (value < 0):
                return value.toFixed(fractionDigits)
                    .replace(this.seperators[0], this.seperators[1])
                    .replace(this.regEx, '$1' + this.seperators[0]) + (addSymbol ? '% ▼' : '')
            case (value > 0):
                return value.toFixed(fractionDigits)
                    .replace(this.seperators[0], this.seperators[1])
                    .replace(this.regEx, '$1' + this.seperators[0]) + (addSymbol ? '% ▲' : '')
        }
    }

    //#endregion

    //#region private methods

    private getLanguage(): string {
        return this.helperService.readItem("language") == '' ? 'el-GR' : this.helperService.readItem("language")
    }

    private setSeperators(): string[] {
        switch (this.language) {
            case 'cs-CZ':
                return [',', '.']
            case 'de-DE':
                return ['.', ',']
            case 'el-GR':
                return ['.', ',']
            case 'en-GB':
                return [',', '.']
            case 'fr-FR':
                return [' ', ',']
        }
    }

    //#endregion

}