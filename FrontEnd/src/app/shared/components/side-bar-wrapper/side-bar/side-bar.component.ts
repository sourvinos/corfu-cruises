import { Component } from '@angular/core'
import { slideFromLeft } from 'src/app/shared/animations/animations'

@Component({
    selector: 'side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css'],
    animations: [slideFromLeft]
})

export class SideBarComponent { }
