import { CartService } from './../cart.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from '../services/http-error-handler.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { stringify } from 'querystring';
import { response } from 'express';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})

export class CartComponent implements OnInit {

  totalPrice = 0;
  cumulativePrice: number;
  totalQty = 0;
  cart: any[];
  orderItems: any[];
  orderItem: any[];
  orderID: string;
  message = '';

  Name: string;
  address: string;
  mobile: number;
  items;
  user: any;
  email: string;
  payment: string;
  userId = firebase.auth().currentUser.uid;
  

  constructor(private cartService: CartService,
              public router: Router,
              private http: HttpClient,
              private httpErrorHandler: HttpErrorHandler) {

  }

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.getCartItems();
  }

  getCartItems(){
    firebase.firestore().collection('users').doc(this.userId).get().then((doc) => {
      if (doc.data().cartItems){
        this.cart = doc.data().cartItems;
        this.cart.forEach(item => {
          this.totalPrice += item.quantity * item.price;
          this.cumulativePrice = item.quantity * item.price;
          this.totalQty += item.quantity;
        });
      }
      else{
        this.message = 'No product added in the cart! Please shop from our Products section.';
      }
    }).catch((error) => {
      this.message = 'Error while loading! Please check your network connection.';
    });

  }

  // remove(index){

  //   let userId = firebase.auth().currentUser.uid;
  //   let docRef = firebase.firestore().collection('users').doc(userId);
  //   docRef.update({
  //   ['cartItems.' + index]: firebase.firestore.FieldValue.delete()
  //   })
  // }

  emptyCart(){
    this.cartService.clearCart();
    firebase.firestore().collection('users').doc(this.userId).update({
      cartItems: firebase.firestore.FieldValue.delete()
    }).then(() => {
      // this.router.navigate(['/products']);
    });
  }

  toProducts(){
    this.router.navigate(['/products']);
  }
  
    



   async getPaytm(orderID,customerId,totalPrice,e_mail,mobile){

    var dataSet : any = {
      txnamount : totalPrice,
      odId : orderID,
      cstId : customerId,
      mob : mobile,
      email : e_mail
    };
  
   var options = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(dataSet)
    };

    const response = await fetch('/payment', options);
    const json = await response.json();
    console.log(json);
    
    window.location.href = '/paytm';

  }

  getStatus(orderID){
    var options = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({odId : orderID})
    };

    fetch('/paytm-success').then((response) => {
      console.log(response);
    })
  }


  storeShippingDetails(){

    let shippingDetails = {
      name : this.Name,
      shippingAddress: this.address,
      mobile: this.mobile
    }
    firebase.firestore().collection('users').doc(this.userId).set({
      shippingDetails : shippingDetails
    })

  }

  placeOrder() {

    firebase.firestore().collection('users').doc(this.userId).get().then((querySnapshot) => {
     this.email = querySnapshot.data().email;
     var orderID : string= 'OD' + (Math.floor(Math.random()*10000000000000000));
     

     if(this.payment == 'onlinePayment'){
       this.storeShippingDetails();
       

       this.getPaytm(orderID,this.userId,this.totalPrice,this.email,this.mobile)
     }
     else if(this.payment == 'COD'){

      firebase.firestore().collection('orders').doc(orderID).set({
        customerId: firebase.auth().currentUser.uid,
        name: this.Name,
        email: this.email,
        shippingAddress: this.address,
        mobile: this.mobile,
        totalPrice: this.totalPrice,
        totalQuantity: this.totalQty,
        orderedOn: firebase.firestore.FieldValue.serverTimestamp(),
        orderItems: this.cart,
        processed: false
        }).then((data) => {
  
          firebase.firestore().collection('users').doc(this.userId).collection('myOrders').doc(orderID).set({
            name: this.Name,
            shippingAddress: this.address,
            mobile: this.mobile,
            totalPrice: this.totalPrice,
            totalQuantity: this.totalQty,
            orderedOn: firebase.firestore.FieldValue.serverTimestamp(),
            orderItems: this.cart,
          });

          window.alert('Order placed successfully!');
          
          // this.emptyCart();
        });

     }

    })
    
  }

}
