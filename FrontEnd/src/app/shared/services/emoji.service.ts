import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class EmojiService {

    public getEmoji(emoji: string) {
        switch (emoji) {
            case 'error': return '❌ '
            case 'inactive-user': return '😴'
            case 'no-results': return '😵'
            case 'null': return '🚫'
            case 'ok': return '✔️'
            case 'warning': return '⚠️'
            case 'wildcard': return '⭐'
            case 'remarks': return '✉️'
            case 'sum': return '∑'
        }

    }

}
