import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations'

export const fancyAnimation = trigger('fancyAnimation', [
    transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
            animate('1s ease-in', keyframes([
                style({ opacity: 0, transform: 'translateY(-75px)', offset: 0 }),
                style({ opacity: 0.5, transform: 'translateY(35px)', offset: 0.3 }),
                style({ opacity: 1, transform: 'translateY(0px)', offset: 1 })
            ]))
        ]), { optional: true })
    ])
])

export const slideFromLeft = trigger('slideFromLeft', [
    transition(':enter', [
        style({ transform: 'translateX(-100px)' }),
        animate('0.5s ease-out')
    ])
])

export const slideFromRight = trigger('slideFromRight', [
    transition(':enter', [
        style({ transform: 'translateX(400px)' }),
        animate('0.5s ease-out')
    ])
])
