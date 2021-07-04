import { OverlayModule } from "@angular/cdk/overlay";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { CdkDropdownComponent } from "./cdk-dropdown.component";

@NgModule({
  imports: [CommonModule, OverlayModule, ScrollingModule],
  exports: [CdkDropdownComponent],
  declarations: [CdkDropdownComponent],
  providers: [],
})
export class CdkDropdownModule {}
