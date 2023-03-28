import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from './pipes/title-case.pipe';


@NgModule({
  declarations: [
    AppComponent,
    TitleCasePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
