import { NgModule } from '@angular/core'
// Custom
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { FieldsetModule } from 'primeng/fieldset'
import { ListboxModule } from 'primeng/listbox'
import { MenubarModule } from 'primeng/menubar'
import { PanelMenuModule } from 'primeng/panelmenu'
import { PanelModule } from 'primeng/panel'
import { TableModule } from 'primeng/table'

@NgModule({
    exports: [
        ButtonModule,
        DropdownModule,
        FieldsetModule,
        ListboxModule,
        MenubarModule,
        PanelMenuModule,
        PanelModule,
        TableModule
    ]
})

export class PrimeNgModule { }
