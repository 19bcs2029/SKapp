import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @Input('product') product: any[];

  products: any[] = [];
  loggedIn: boolean = false;
  user: any;

  constructor() {
    this.user = firebase.auth().currentUser;
    if(this.user) {
      this.loggedIn = true;
    }
    else{
      this.loggedIn = false;
    }

    this.getProducts(); 
   }

  ngOnInit(): void {
  }

  getProducts(){

    firebase.firestore().collection("products").orderBy('productName').get().then((querySnapshot) => {

      console.log(querySnapshot);
      this.products = querySnapshot.docs;

    }).catch((error) => {

      console.log(error);
    })
  } 
}