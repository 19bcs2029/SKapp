import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items = [];

  constructor() { }

  addToCart(product) {
    this.items.push(product);

    const id = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(id).update({
      cartItems: this.items
    });



  }

  getItems() {
    return this.items;
  }

  clearCart(){
    this.items = [];
    return this.items;
  }


}
