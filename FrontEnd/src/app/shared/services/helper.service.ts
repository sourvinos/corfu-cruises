import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Table } from 'primeng/table'
import { defer, finalize, Observable, Subject } from 'rxjs'
// Custom
import { LocalStorageService } from './local-storage.service'
import { ModalActionResultService } from './modal-action-result.service'
import { environment } from 'src/environments/environment'

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

    constructor(private localStorageService: LocalStorageService, private modalActionResultService: ModalActionResultService, private router: Router) { }

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
        const array: any[] = []
        const key = field
        const distinctRecords = [...new Map(records.map(item => [item[key], item])).values()]
        distinctRecords.forEach(element => {
            array.push(element[field])
        })
        array.sort((a, b) => {
            if (a < b) {
                return -1
            }
            if (a > b) {
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
        }, 800)
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

    public enableHorizontalScroll(element): void {
        element.addEventListener('wheel', (evt: WheelEvent) => {
            evt.preventDefault()
            element.scrollLeft += evt.deltaY
        })
    }

    public flattenObject(object: any): any {
        const result = {}
        for (const i in object) {
            if ((typeof object[i]) === 'object' && !Array.isArray(object[i])) {
                const temp = this.flattenObject(object[i])
                for (const j in temp) {
                    result[i + '.' + j] = temp[j]
                }
            }
            else {
                result[i] = object[i]
            }
        }
        return result
    }

    public sortArray(array: any, field: string): any {
        array.sort((a: any, b: any) => {
            if (a[field] < b[field]) {
                return -1
            }
            if (a[field] > b[field]) {
                return 1
            }
            return 0
        })
    }

    public storeScrollTop(element: string): void {
        const body = document.getElementsByClassName(element)[0]
        this.localStorageService.saveItem('scrollTop', body.scrollTop.toString())
    }

    public deepEqual(object1: any, object2: any): boolean {
        const keys1 = Object.keys(object1)
        const keys2 = Object.keys(object2)
        if (keys1.length !== keys2.length) {
            return false
        }
        for (const key of keys1) {
            const val1 = object1[key]
            const val2 = object2[key]
            const areObjects = this.isObject(val1) && this.isObject(val2)
            if (
                areObjects && !this.deepEqual(val1, val2) ||
                !areObjects && val1 !== val2
            ) {
                return false
            }
        }
        return true
    }

    public unHighlightAllRows(): void {
        const x = document.querySelectorAll('.p-highlight')
        x.forEach(row => {
            row.classList.remove('p-highlight')
        })
    }

    //#endregion

    //#region private methods

    private isObject(object: any): boolean {
        return object != null && typeof object === 'object'
    }

    //#endregion

}
