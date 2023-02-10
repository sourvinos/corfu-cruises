import { NgModule } from '@angular/core'
// Custom
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'

@NgModule({
    exports: [
        ButtonModule,
        DropdownModule,
        TableModule
    ]
})

export class PrimeNgModule { }
