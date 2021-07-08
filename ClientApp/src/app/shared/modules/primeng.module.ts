import { NgModule } from '@angular/core'
// Custom
import { MenubarModule } from 'primeng/menubar'
import { PanelMenuModule } from 'primeng/panelmenu'
import { PanelModule } from 'primeng/panel'
import { TableModule } from 'primeng/table'

@NgModule({
    exports: [
        MenubarModule,
        PanelMenuModule,
        PanelModule,
        TableModule
    ]
})

export class PrimeNgModule { }
