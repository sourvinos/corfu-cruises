import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class EmojiService {

    public getEmoji(emoji: string) {
        switch (emoji) {
            case 'null': return '🤪'
            case 'wildcard': return '⭐'
            case 'ok': return '✔️ '
            case 'warning': return '⚠️ '
            case 'error': return '❌ '
            case 'dot': return '◽'
        }

    }

}
