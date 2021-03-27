import { Component } from '@angular/core'
import { InteractionService } from 'src/app/shared/services/interaction.service'

@Component({
    selector: 'side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css']
})

export class SideBarComponent {

    constructor(private interactionService: InteractionService) { }

    ngOnInit(): void {
        this.interactionService.sidebarAndTopMenuVisibility.subscribe((action: string) => {
            if (action == 'hide') {
                if (screen.width < 1681) {
                    document.getElementById('side-logo').style.opacity = document.getElementById('side-logo').style.opacity == '0' ? '1' : '0'
                    document.getElementById('side-image').style.opacity = document.getElementById('side-image').style.opacity == '0' ? '1' : '0'
                    document.getElementById('side-footer').style.opacity = document.getElementById('side-footer').style.opacity == '0' ? '1' : '0'
                    document.getElementById('side-bar').style.width = document.getElementById('side-bar').style.width == '0' ? '16.5' : '0'
                    document.getElementById('side-bar').style.overflow = document.getElementById('side-bar').style.width == '0' ? 'hidden' : 'visible'
                    document.getElementById('top-logo').style.display = document.getElementById('top-logo').style.display == 'flex' ? 'none' : 'flex'
                }
            } else {
                document.getElementById('side-logo').style.opacity = '1'
                document.getElementById('side-image').style.opacity = '1'
                document.getElementById('side-footer').style.opacity = '1'
                document.getElementById('side-bar').style.width = '16.5rem'
                document.getElementById('side-bar').style.overflow = 'hidden'
                document.getElementById('top-logo').style.display = 'none'
            }
        })

    }

}
