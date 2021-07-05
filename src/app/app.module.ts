import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CdkDropdownModule } from './components/cdk-dropdown/cdk-dropdown.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CdkDropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
