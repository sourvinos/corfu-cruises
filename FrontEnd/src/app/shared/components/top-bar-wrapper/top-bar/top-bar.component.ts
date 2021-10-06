import { Component } from '@angular/core'

@Component({
    selector: 'top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent {

    public onClickMenu(): void {
        document.getElementById('hamburger-menu').classList.toggle('visible')
        document.getElementById('secondary-menu').classList.toggle('visible')
    }

}
