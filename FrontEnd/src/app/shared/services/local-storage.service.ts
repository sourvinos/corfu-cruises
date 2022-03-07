import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class LocalStorageService {

    //#region public methods

    public getItem(item: string): string {
        return localStorage.getItem(item) || ''
    }

    public getLanguage(): string {
        const language = localStorage.getItem('language')
        if (language == null) {
            localStorage.setItem('language', 'en-gb')
            return 'en-gb'
        }
        return language
    }

    public saveItem(key: string, value: string): void {
        localStorage.setItem(key, value)
    }

    public deleteItems(items: string[]): void {
        items.forEach(element => {
            this.deleteItem(element)
        })
    }

    //#endregion

    //#region private methods

    private deleteItem(key: string): void {
        localStorage.removeItem(key)
    }

    //#endregion

}
