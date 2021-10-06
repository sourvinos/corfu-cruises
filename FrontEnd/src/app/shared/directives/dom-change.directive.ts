import { Directive, ElementRef, EventEmitter, Output } from '@angular/core'

@Directive({ selector: '[domChange]' })

export class DomChangeDirective {

    //#region variables

    private changes: MutationObserver

    //#endregion

    @Output() public domChange = new EventEmitter()

    constructor(private elementRef: ElementRef) {

        const element = this.elementRef.nativeElement

        this.changes = new MutationObserver((mutations: MutationRecord[]) => {
            mutations.forEach((mutation: MutationRecord) => this.domChange.emit(mutation))
        })

        this.changes.observe(element, {
            attributes: true,
            childList: true,
            characterData: true
        })
    }

    //#region lifecycle hooks

    ngOnDestroy(): void {
        this.changes.disconnect()
    }

    //#endregion

}
