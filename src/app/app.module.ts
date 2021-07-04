import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CdkDropdownModule } from './components/cdk-dropdown/cdk-dropdown.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CdkDropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
