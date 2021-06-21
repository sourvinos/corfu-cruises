import { NgModule } from '@angular/core'
// Custom
import { DropdownModule } from 'primeng/dropdown'
import { MenubarModule } from 'primeng/menubar'
import { PanelMenuModule } from 'primeng/panelmenu'
import { TableModule } from 'primeng/table'

@NgModule({
    exports: [
        DropdownModule,
        MenubarModule,
        PanelMenuModule,
        TableModule
    ]
})

export class PrimeNgModule { }
