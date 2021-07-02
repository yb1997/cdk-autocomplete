import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {OverlayModule} from '@angular/cdk/overlay';

import { AppComponent } from './app.component';
import { CdkDropdownComponent } from './components/cdk-dropdown/cdk-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    CdkDropdownComponent
  ],
  imports: [
    BrowserModule,
    OverlayModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
