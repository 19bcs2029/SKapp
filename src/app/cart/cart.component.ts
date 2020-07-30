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


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
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

  paymentUrl: string = `http://localhost:3000/payment`;
  
  private apiUrl = `${environment.apiUrl}/payment`;
  private handleError: HandleError;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  userId = firebase.auth().currentUser.uid;

  constructor(private cartService: CartService,
              public router: Router,
              private http: HttpClient,
              private httpErrorHandler: HttpErrorHandler) {

    // this.user = firebase.auth().currentUser;
    this.handleError = this.httpErrorHandler.createHandleError('CartComponent')
    this.getCartItems();

  }

  ngOnInit(): void {
    this.items = this.cartService.getItems();
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
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(userId).update({
      cartItems: firebase.firestore.FieldValue.delete()
    }).then(() => {
      // this.router.navigate(['/products']);
    });
  }

  toProducts(){
    this.router.navigate(['/products']);
  }


  dataSet: any = [{
    "totalPrice" : this.totalPrice,
    "orderID" : this.orderID,
    "customerId" : firebase.auth().currentUser.uid,
    "mobile" : this.mobile,
    "email" : this.email
  }];

  sendData(dataSet: any){
    return this.http.post(this.paymentUrl,dataSet).toPromise().then((data) => {
      console.log(data);
    });
    
  }

  getPaytm(){
    return this.http.post(`http://localhost:3000/payment`,this.dataSet);
    
  
  };

  placeOrder() {

    firebase.firestore().collection('users').doc(this.userId).get().then((querySnapshot) => {
      this.email = querySnapshot.data().email;

      firebase.firestore().collection('orders').add({
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
  
          this.orderID = data.id;
          this.dataSet.push(this.orderID);

          

          // this.getPaytm();
          
  
          firebase.firestore().collection('users').doc(this.userId).collection('myOrders').doc(this.orderID).set({
            name: this.Name,
            shippingAddress: this.address,
            mobile: this.mobile,
            totalPrice: this.totalPrice,
            totalQuantity: this.totalQty,
            orderedOn: firebase.firestore.FieldValue.serverTimestamp(),
            orderItems: this.cart,
          });
  
          





  
          window.alert('Order placed successfully!');
          this.emptyCart();
        });

    });

    

      
      
  }

}
