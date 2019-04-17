import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Utils } from '../../providers/common/utils';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  identity: any;
  email: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    public auth: AuthServiceProvider,
    private utils: Utils,
    public  storage: Storage) {
      var self = this
      this.identity = JSON.parse(localStorage.getItem('identity'));
      this.email = this.identity.des_email;
  }



  ionViewDidLoad() {
    console.log('this.identitys');
    //debugger;
    console.log(this.identity);
  }
  
  goToHome(){
    this.navCtrl.setRoot('HomePage', {}, {animate: true, direction: 'forward'});
  }
}
