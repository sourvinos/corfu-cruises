import { Component } from '@angular/core'

@Component({
    selector: 'top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent {

    public isLoginVisible: boolean

    public onClickMenu(): void {
        document.getElementById('hamburger-menu').classList.toggle('visible')
        document.getElementById('secondary-menu').classList.toggle('visible')
    }

    ngDoCheck(): void {
        const element = document.getElementById('login-form')
        if (typeof (element) != 'undefined' && element != null) {
            this.isLoginVisible = true
        } else {
            this.isLoginVisible = false
        }

    }

}
