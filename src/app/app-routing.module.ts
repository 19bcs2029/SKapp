import { OrderRequestsComponent } from './orders/order-requests/order-requests.component';
import { CartComponent } from './cart/cart.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { SellproductComponent } from './sellproduct/sellproduct.component';
import { ProcessedOrdersComponent } from './orders/orders-requests/processed-orders/processed-orders.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [{
  path: '', redirectTo: 'home', pathMatch: 'full'
}, {
  path: 'home', component: HomeComponent
}, {
  path: 'about',component: AboutComponent
}, {
  path: 'products',component: ProductsComponent
}, {
  path: 'login', component: LoginComponent
}, {
  path: 'signup', component: SignupComponent
}, {
  path: 'contact', component: ContactComponent
}, {
  path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard]
},{
  path: 'sellproduct', component: SellproductComponent, canActivate: [AuthGuard]
}, {
  path: 'cart', component : CartComponent, canActivate: [AuthGuard]
}, 

// {path: 'payment', component: PaymentComponent},
   {
  path: 'orderRequests', component: OrderRequestsComponent, canActivate: [AuthGuard]
}, {
  path: 'processedOrders', component: ProcessedOrdersComponent, canActivate: [AuthGuard]
}, {
  path: '**', redirectTo: 'home'
}]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
