import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";


@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }
  gotoback(){
    this.navCtrl.setRoot(HomePage);
  }
  showLoading() {
      this.loadingCtrl.create({
          duration: 1500,
          content: 'Carregando ...'
      }).present();
  }

}
