import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppLayoutComponent } from "./app.layout.component";
import { MenubarModule } from "primeng/menubar";
import { AvatarModule } from "primeng/avatar";
import { MenuModule } from "primeng/menu";
import { AppTopBarComponent } from "./app.topbar.component";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { MegaMenuModule } from "primeng/megamenu";
import { TabMenuModule } from "primeng/tabmenu";

@NgModule({
  declarations: [AppLayoutComponent, AppTopBarComponent],
  imports: [
    CommonModule,
    MenubarModule,
    AvatarModule,
    MenuModule,
    BreadcrumbModule,
    MegaMenuModule,
    TabMenuModule,
  ],
  exports: [AppLayoutComponent, AppTopBarComponent],
})
export class AppLayoutModule {}
