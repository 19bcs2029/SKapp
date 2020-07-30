import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = {};
  orders: any[] = [];

  @Input('order') order: any[];

  constructor(public activatedRoute: ActivatedRoute) {

    let id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(id);

    this.getProfile(id);
    this.getOrders();
   }

  ngOnInit(): void {
  }

  getProfile(id: string){

    firebase.firestore().collection("users").doc(id).get().then((documentSnapshot) => {

      this.user = documentSnapshot.data();
      this.user.displayName = this.user.firstName + " "  + this.user.lastName;
      this.user.id = documentSnapshot.id;
      this.user.accountType = this.user.accountType;
    }).catch((error) => {
      console.log(error);
    })
  }

  getOrders(){

    let userId = firebase.auth().currentUser.uid;
    firebase.firestore().collection('orders').where('customerId', '==', userId).get().then((data) => {

      this.orders = data.docs;
      // console.log(this.orders);
    })
  }

}
