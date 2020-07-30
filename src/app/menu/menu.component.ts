import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  loggedIn: boolean = false;
  user: any;
  userInfo: any = {};
  orderList: any [];

  constructor(private router: Router) { 
    this.user = firebase.auth().currentUser;
    this.getNewOrders();
    
    if(this.user) {
      this.loggedIn = true;
    }
    else{
      this.loggedIn = false;
    }

    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if(user){
        this.loggedIn = true;
        let uid =this.user.uid;

        firebase.firestore().collection("users").doc(uid).get().then((documentSnapshot) => {

          this.userInfo = documentSnapshot.data();
          this.userInfo.accountType = this.userInfo.accountType;
    
        }).catch((error) => {
          console.log(error);
        })
       
      }
      else{
        this.loggedIn = false;
      }
    })
  }

  ngOnInit(): void {

  }

  getNewOrders(){
    firebase.firestore().collection('orders').where('processed', '==', false).get().then((querySnapshot) => {
      this.orderList = querySnapshot.docs;
    })
  }

  hasRoute(route: string){
    return this.router.url.includes(route);
  }

  logout(){
    firebase.auth().signOut();
  }
}
