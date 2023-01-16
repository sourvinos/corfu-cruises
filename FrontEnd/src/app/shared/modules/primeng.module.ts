import { NgModule } from '@angular/core'
// Custom
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { FieldsetModule } from 'primeng/fieldset'
import { ListboxModule } from 'primeng/listbox'
import { TableModule } from 'primeng/table'

@NgModule({
    exports: [
        ButtonModule,
        DropdownModule,
        FieldsetModule,
        ListboxModule,
        TableModule
    ]
})

export class PrimeNgModule { }
