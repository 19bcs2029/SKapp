import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from "@angular/router";
import { HttpErrorHandler } from './services/http-error-handler.service';
import { MessageService } from './services/message.service';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { SellproductComponent } from './sellproduct/sellproduct.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderItemComponent } from './orders/order-item/order-item.component';
import { OrderRequestsComponent } from './orders/order-requests/order-requests.component';
import { DatePipe } from '@angular/common';
import { ProcessedOrdersComponent } from './orders/orders-requests/processed-orders/processed-orders.component';
import { PaymentComponent } from './payment/payment.component';

let firebaseConfig = {
  apiKey: "AIzaSyBe3xIEN659DpsbM2_pxBRPmn_Iptxh980",
  authDomain: "sk-traders-509b1.firebaseapp.com",
  databaseURL: "https://sk-traders-509b1.firebaseio.com",
  projectId: "sk-traders-509b1",
  storageBucket: "sk-traders-509b1.appspot.com",
  messagingSenderId: "102149414781",
  appId: "1:102149414781:web:8692971764ad342afff614",
  measurementId: "G-8BZWD82KGZ"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    SignupComponent,
    ProductsComponent,
    ProfileComponent,
    SellproductComponent,
    ProductComponent,
    CartComponent,
    OrdersComponent,
    OrderItemComponent,
    OrderRequestsComponent,
    ProcessedOrdersComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    HttpClientModule,
  ],
  providers: [ 
    DatePipe,
    HttpErrorHandler,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
