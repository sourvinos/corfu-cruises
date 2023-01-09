import { NgModule } from '@angular/core'
// Custom
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { FieldsetModule } from 'primeng/fieldset'
import { ListboxModule } from 'primeng/listbox'
import { TableModule } from 'primeng/table'
import { TreeTableModule } from 'primeng/treetable'

@NgModule({
    exports: [
        AccordionModule,
        ButtonModule,
        DropdownModule,
        FieldsetModule,
        ListboxModule,
        TableModule,
        TreeTableModule
    ]
})

export class PrimeNgModule { }
