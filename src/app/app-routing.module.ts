import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CollectorTableComponent } from './collector-table/collector-table.component';
import { CollectorsComponent } from './collectors/collectors.component';
import { ColorComponent } from './color/color.component';
import { FooterComponent } from './footer/footer.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { GroupsComponent } from './groups/groups.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginMangarComponent } from './login-mangar/login-mangar.component';
import { LoginComponent } from './login/login.component';
import { MangarComponent } from './mangar/mangar.component';
import { productModels } from './Model/productModels';
import { OdotComponent } from './odot/odot.component';
import { ProductModleComponent } from './product-modle/product-modle.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { ProductComponent } from './product/product.component';
import { ReadExcelComponent } from './read-excel/read-excel.component';
import { RegistrationComponent } from './registration/registration.component';
import { ShowProductInOrderComponent } from './show-product-in-order/show-product-in-order.component';
import { SighOutComponent } from './sigh-out/sigh-out.component';
import { TrackComponent } from './track/track.component';
import { UplodeMapComponent } from './uplode-map/uplode-map.component';



const routes: Routes = 
[
  {path:'',component:HomeComponent},
{path:'home',component:HomeComponent},
{path:'login',component:LoginComponent},
{path:'header',component:HeaderComponent},
{path:'registration',component:RegistrationComponent},
{path:'odot',component:OdotComponent},
{path:'sigh-out',component:SighOutComponent},
{path:'mangar',component:MangarComponent,children:
[
{path:'product',component:ProductComponent},{path:'collector-table',component:CollectorTableComponent},{path:'excel',component:ReadExcelComponent},{path:'uploadeMap',component:UplodeMapComponent},{path:'productTable',component:ProductTableComponent}
]},
{path:'footer',component:FooterComponent},
{path:'collectors',component:CollectorsComponent},
{path:'track',component:TrackComponent},
{path:'collector-table',component:CollectorTableComponent},
{path:'product',component:ProductComponent},
{path:'groups',component:GroupsComponent},
{path:'productModels',component:ProductModleComponent},
{path:'colors',component:ColorComponent},
{path:'productTable',component:ProductTableComponent},
{path:'forgetP',component:ForgetPasswordComponent},
{path:'excel',component:ReadExcelComponent},
{path:'uploadeMap',component:UplodeMapComponent},
{path:'loginMangar',component:LoginMangarComponent},
{path:'enter',component:AppComponent},
{path:'showProductInOrder/:id',component:ShowProductInOrderComponent},
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  
})
export class AppRoutingModule { }
