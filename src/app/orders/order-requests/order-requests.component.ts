import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-requests',
  templateUrl: './order-requests.component.html',
  styleUrls: ['./order-requests.component.css']
})
export class OrderRequestsComponent implements OnInit {



  orderList: any[];
  items: any[] = [];
  dates: any[] = [];
  quantities: any[] = [];
  netAmounts: any[] = [];
  names: any[] = [];
  addresses: any[] = [];
  mobiles: any[] = [];
  customerIds: any[] = [];
  emails: any[] = [];

  constructor(private dp: DatePipe) {

   }

  ngOnInit(): void {
    this.getNewOrders();
  }

  getNewOrders(){
    const userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('orders').orderBy('orderedOn', 'desc').where('processed', '==', false).get().then((querySnapshot) => {
      this.orderList = querySnapshot.docs;
      this.orderList.forEach((item) => {
        this.items.push(item.data().orderItems);
        this.dates.push(item.data().orderedOn);
        this.quantities.push(item.data().totalQuantity);
        this.netAmounts.push(item.data().totalPrice);
        this.names.push(item.data().name);
        this.addresses.push(item.data().shippingAddress);
        this.mobiles.push(item.data().mobile);
        this.customerIds.push(item.data().customerId);
        this.emails.push(item.data().email);
      });

    });
  }

  markProcessed(id){
    firebase.firestore().collection('orders').doc(id).update({
      processed: true,
    }).then(() => {
      window.location.reload();
    });
  }
}
