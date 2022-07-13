
import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import{ReactiveFormsModule} from '@angular/forms'
import{HeaderComponent} from 'src/app/header/header.component';
import { LoginComponent } from './login/login.component';
import {RouterModule,Routes} from '@angular/router'
import { FooterComponent } from './footer/footer.component';
import { RegistrationComponent } from './registration/registration.component';
import { SighOutComponent } from './sigh-out/sigh-out.component';
import { OdotComponent } from './odot/odot.component';
import { MangarComponent } from './mangar/mangar.component';
import {TrackComponent} from './track/track.component'
import {HttpClientModule} from '@angular/common/http';
import {CollectorsComponent} from './collectors/collectors.component';
import { CollectorTableComponent } from './collector-table/collector-table.component';
import { ProductComponent } from './product/product.component';
import { GroupsComponent } from './groups/groups.component';
import { ProductModleComponent } from './product-modle/product-modle.component';
import { ColorComponent } from './color/color.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { HomeComponent } from './home/home.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ReadExcelComponent } from './read-excel/read-excel.component';
import { UplodeMapComponent } from './uplode-map/uplode-map.component';
import { LoginMangarComponent } from './login-mangar/login-mangar.component';
import { Sidenav1Component } from './sidenav1/sidenav1.component';
import { ShowNameGPipe } from './pipe/show-name-g.pipe';
import { ShowProductInOrderComponent } from './show-product-in-order/show-product-in-order.component';
import { ShowNameSPipe } from './show-name-s.pipe';
import { ShowNamegPipe } from './pipe/show-nameg.pipe';
import { ShowNamePPipe } from './pipe/show-name-p.pipe';
import { ShowNameCPipe } from './pipe/show-name-c.pipe';
import { ShowNameProductPipe } from './pipe/show-name-product.pipe';
import { ProductModelPipe } from './pipe/product-model.pipe';
import { ShowPosionPipe } from './pipe/show-posion.pipe';
import { ShowCoulmPipe } from './pipe/show-coulm.pipe';



@NgModule({
  declarations: [
    AppComponent, HeaderComponent,
    LoginComponent,FooterComponent,RegistrationComponent,SighOutComponent,OdotComponent,MangarComponent,
    CollectorsComponent,TrackComponent,
    CollectorTableComponent,
    ProductComponent,
    GroupsComponent,
    ProductModleComponent,
    ColorComponent,
    ProductTableComponent,
    HomeComponent,
    ForgetPasswordComponent,
    ReadExcelComponent,
    UplodeMapComponent,
    LoginMangarComponent,
    Sidenav1Component,
    ShowNameGPipe,
    ShowProductInOrderComponent,
    ShowNameSPipe,
    ShowNamegPipe,
    ShowNamePPipe,
    ShowNameCPipe,
    ShowNameProductPipe,
    ProductModelPipe,
    ShowPosionPipe,
    ShowCoulmPipe,

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
