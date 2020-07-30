import { CartService } from './../cart.service';
import { Component, OnInit, Input, Output } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  quantity: number;
  buttonClicked: boolean = false;
 
  @Input('product') product: any;

  showModal: boolean;
  productData: any = {};
  cartItems: any[] = [];
  

  constructor(private cartService: CartService) { 
  }

  ngOnInit(): void {
    this.productData = this.product.data();
  }


  show()
  {
    this.showModal = true; // Show-Hide Modal Check
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }

  addToCart(product) {

    product.quantity = this.quantity;
    product.productId = this.product.id;
    product.cumulativePrice = this.quantity * this.productData.price;
    product.orderedById = firebase.auth().currentUser.uid;
    // product.addedToCartOn = firebase.firestore.FieldValue.serverTimestamp();
    this.cartService.addToCart(product);
    this.buttonClicked = true;
    this.quantity = undefined;
  }

}
