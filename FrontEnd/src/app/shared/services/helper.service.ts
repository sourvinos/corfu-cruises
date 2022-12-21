import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { defer, finalize, Observable, Subject } from 'rxjs'
// Custom
import { ModalActionResultService } from './modal-action-result.service'
import { environment } from 'src/environments/environment'
import { Table } from 'primeng/table'

export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => defer(() => {
        callback()
        return source
    })
}

export function indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => source.pipe(
        prepare(() => indicator.next(true)),
        finalize(() => indicator.next(false))
    )
}

@Injectable({ providedIn: 'root' })

export class HelperService {

    //#region variables

    private appName = environment.appName

    //#endregion

    constructor(private modalActionResultService: ModalActionResultService, private router: Router) { }

    //#region public methods

    public doPostSaveFormTasks(message: string, iconType: string, returnUrl: string, form: any, formReset = true, goBack = true): Promise<any> {
        const promise = new Promise((resolve) => {
            this.modalActionResultService.open(message, iconType, ['ok']).subscribe(() => {
                formReset ? form.reset() : null
                goBack ? this.router.navigate([returnUrl]) : null
                resolve(null)
            })
        })
        return promise
    }

    public calculateTableWrapperHeight(topBar: string, header: string, footer: string): string {
        return window.innerHeight
            - document.getElementById(topBar).getBoundingClientRect().height
            - document.getElementById(header).getBoundingClientRect().height
            - document.getElementById(footer).getBoundingClientRect().height + 'px'
    }

    public enableOrDisableAutoComplete(event: { key: string }): boolean {
        return (event.key == 'Enter' || event.key == 'ArrowUp' || event.key == 'ArrowDown' || event.key == 'ArrowRight' || event.key == 'ArrowLeft') ? true : false
    }

    public formatRefNo(refNo: string, returnsHTML: boolean): string {
        const destination = new RegExp(/[a-zA-Z]{1,5}/).exec(refNo)[0]
        const number = new RegExp(/[0-9]{1,5}/g).exec(refNo).slice(-5)[0]
        const zeros = '00000'.slice(number.length)
        if (returnsHTML)
            return '<span>' + destination.toUpperCase() + '</span>' + '-' + '<span>' + zeros + '</span>' + '<span>' + number + '</span>'
        else
            return destination.toUpperCase() + '-' + zeros + number
    }

    public getApplicationTitle(): any {
        return this.appName
    }

    public getDistinctRecords(records: any[], field: string): any[] {
        let unique = []
        const array: any[] = []
        unique = [... new Set(records.map(x => x[field]))]
        unique.forEach(element => {
            array.push({ label: element, value: element })
        })
        array.sort((a, b) => {
            if (a.value < b.value) {
                return -1
            }
            if (a.value > b.value) {
                return 1
            }
            return 0
        })
        return array
    }

    public populateTableFiltersDropdowns(records: any[], field: any): any[] {
        const array: any[] = []
        const elements = [... new Set(records.map(x => x[field]))]
        elements.forEach(element => {
            if (typeof (element) == 'string') {
                array.push({ label: element == '(EMPTY)' ? '(EMPTY)' : element, value: element })
            }
            if (typeof (element) == 'object') {
                array.push({ label: element.description == '(EMPTY)' ? '(EMPTY)' : element.description, value: element.description })
            }

        })
        array.sort((a, b) => (a.label > b.label) ? 1 : -1)
        return array
    }

    public focusOnField(element: string): void {
        setTimeout(() => {
            const input = <HTMLInputElement>document.getElementById(element)
            input.focus()
            input.select()
        }, 1000)
    }

    public toggleActiveItem(item: string, lookupArray: string[], className: string): any {
        const element = document.getElementById(item)
        if (element.classList.contains(className)) {
            for (let i = 0; i < lookupArray.length; i++) {
                if ((lookupArray)[i] === item) {
                    lookupArray.splice(i, 1)
                    i--
                    element.classList.remove(className)
                    break
                }
            }
        } else {
            element.classList.add(className)
            lookupArray.push(item)
        }
        return lookupArray
    }

    public disableTableDropdownFilters(): void {
        const dropdownFilters = document.querySelectorAll('.p-dropdown')
        dropdownFilters.forEach(x => {
            x.classList.add('p-disabled')
        })
    }

    public disableTableTextFilters(): void {
        const textFilters = document.querySelectorAll('.p-inputtext')
        textFilters.forEach(x => {
            x.classList.add('p-disabled')
        })
    }

    public clearTableTextFilters(table: Table, inputs: string[]): void {
        table.clear()
        inputs.forEach(input => {
            table.filter('', input, 'contains')
        })
        document.querySelectorAll<HTMLInputElement>('.p-inputtext, .mat-input-element').forEach(box => {
            box.value = ''
        })
    }

    public enableHorizontalScroll(element):void{
        element.addEventListener('wheel', (evt: WheelEvent) => {
            evt.preventDefault()
            element.scrollLeft += evt.deltaY
        })
    }

    //#endregion

}
