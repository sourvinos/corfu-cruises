import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({ providedIn: 'root' })

export class LocalStorageService {

    //#region public methods

    public getItem(item: string): string {
        return localStorage.getItem(item) || ''
    }

    public getLanguage(): string {
        const language = localStorage.getItem('language')
        if (language == null) {
            localStorage.setItem('language', environment.defaultLanguage)
            return environment.defaultLanguage
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
