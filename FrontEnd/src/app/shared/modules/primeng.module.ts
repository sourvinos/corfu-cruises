import { NgModule } from '@angular/core'
// Custom
import { ButtonModule } from 'primeng/button'
import { DropdownModule } from 'primeng/dropdown'
import { ListboxModule } from 'primeng/listbox'
import { MenubarModule } from 'primeng/menubar'
import { PanelMenuModule } from 'primeng/panelmenu'
import { PanelModule } from 'primeng/panel'
import { SpeedDialModule } from 'primeng/speeddial'
import { TableModule } from 'primeng/table'

@NgModule({
    exports: [
        ButtonModule,
        DropdownModule,
        ListboxModule,
        MenubarModule,
        PanelMenuModule,
        PanelModule,
        SpeedDialModule,
        TableModule
    ]
})

export class PrimeNgModule { }
