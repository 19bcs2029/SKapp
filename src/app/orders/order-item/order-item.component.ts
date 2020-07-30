import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  orderList: any[];
  items: any[] = [];
  dates: any[] = [];
  quantities: any[] = [];
  netAmounts: any[] = [];

  constructor(private dp: DatePipe) {
    this.getMyOrders();
  }

  ngOnInit(): void {
  }

  getMyOrders(){
    let userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(userId).collection('myOrders').orderBy("orderedOn","desc").get().then((querySnapshot) => {
      this.orderList = querySnapshot.docs;
      this.orderList.forEach((item) => {
        this.items.push(item.data().orderItems);
        this.dates.push(item.data().orderedOn);
        this.quantities.push(item.data().totalQuantity);
        this.netAmounts.push(item.data().totalPrice);
      });

    });
  }
}
