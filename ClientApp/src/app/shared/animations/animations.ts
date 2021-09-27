import { trigger, transition, style, animate, query, stagger, keyframes, group } from '@angular/animations'

export const fancyAnimation = trigger('fancyAnimation', [
    transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('300ms', [
            animate('1s ease-in', keyframes([
                style({ opacity: 0, transform: 'translateY(-75px)', offset: 0 }),
                style({ opacity: 0.5, transform: 'translateY(35px)', offset: 0.3 }),
                style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
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

export const routeAnimation = trigger('routeAnimation', [
    transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, leave', [
            style({
                position: 'absolute',
                top: 0,
                left: 0,
            })
        ], { optional: true }),
        query(':enter', [
            style({ opacity: '0' })
        ], { optional: true }),
        group([
            query(':enter', [
                animate('300ms ease-out', style({ opacity: '1' }))
            ], { optional: true }),
            query(':leave', [
                animate('300ms ease-out', style({ opacity: '0' }))
            ], { optional: true }),
        ])
    ])
])