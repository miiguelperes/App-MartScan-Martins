import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, Keyboard, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {CheckoutPage} from "../checkout/checkout";
import { HomePage } from '../home/home';

import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { Utils } from '../../providers/common/utils';
import { Storage } from '@ionic/storage';
import { SuperTabsController } from 'ionic2-super-tabs';

@IonicPage()

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})

export class CartPage {
    rootNavCtrl: NavController;
    soloTrue =  false;
    isNew = true;
    form: FormGroup;

    @ViewChild(Content) content: Content;

    isKeyboardHide: boolean = true;

    add_str: string = 'Adicionar';

    private items = [];
    totals: any;
    qtd_item: number;
    showEmptyCartMessage: boolean = false;

    constructor(
        platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private keyboard: Keyboard,
        private loadingCtrl: LoadingController,
        private cartService: CartServiceProvider,
        private utils: Utils,
        private fb: FormBuilder,
        private storage: Storage,
        private superTabsCtrl: SuperTabsController
    ) {
        this.rootNavCtrl = navParams.get('rootNavCtrl');
        if (this.navParams.get('soloTrue')) {
            this.soloTrue = true;
        }

        this.form = this.fb.group({
            qtd_item: ['', Validators.required]
        });

        this.storage.ready().then( () => {
            this.storage.get("cart").then( (data) => {
                this.items = data;
                console.log(this.items);

                if (this.isArray(this.items)) {
                    this.items.forEach( (item, index) => {
                        this.totals = this.totals + (item._preco * item._qty)
                })
                } else {
                    this.showEmptyCartMessage = true;
                }
            })
        })
    }

    ionViewDidEnter() {
        this.carregaItems();
    }

    loadItems(): any {
        return this.cartService.items;
    }

    isArray(obj : any ) {
        return Array.isArray(obj)
     }

    total() {
        return this.cartService.sumItems();
    }

    carregaItems() {
        this.storage.get("cart").then((val) => {
            this.items = val;
        });
    }
    scanNow(){
        this.superTabsCtrl.slideTo(0);
    }

    clearCart(){
        this.items = [];
        this.utils.clear();
        this.superTabsCtrl.slideTo(0);
    }
    goToHome(){
        this.navCtrl.setRoot('HomePage', {}, {animate: true, direction: 'forward'});
    }

    changeQty(item, i) {
        let price  = 0;
        let qty    = 0;
        let change = this.form.value;

        price = parseFloat(item._preco);
        qty = item._qty;
    
        if (change < 0 && item.qty == 1) {
          return;
        }
    
        qty          = 5; //qty + change;
        item._qty    = qty;
        item._amount = qty * price;

        console.log("Items: ", this.items);
    
        //this.items[i] = item;
        this.storage.set("cart", this.items).then( () => {
            this.utils.showToast("Produto atualizado com sucesso.");
        });
    }

    removeFromCart(item, i) {
        let price = item._preco;
        let qty   = item._qty;
    
        this.items.splice(i, 1);
    
        this.storage.set("cart", this.items).then( ()=> {
            this.totals = this.totals - (price * qty);
        });
    
        if (this.items.length == 0) {
            this.showEmptyCartMessage = true;
        }
    }

    checkout() {
        /*
        this.storage.get("userLoginInfo").then( (data) => {
            if (data != null) {
                this.navCtrl.push('Checkout');
            } else {
                this.navCtrl.push('Login', {next: 'Checkout'})
            }
        });
        */
    }

    buttonAdd(id: number){
        this.items.forEach(function (value) {
            if(value.id == id){
                if(!value.btn)
                    value.btn = true;
                else
                    value.btn = false;
            }
        });
    }

    pushPage(localNavCtrl: boolean = false) {
        if (localNavCtrl) {
            this.navCtrl.push('CheckoutPage');
        } else {
            this.rootNavCtrl.push('CheckoutPage');
        }
    }

    showLoading() {
        this.loadingCtrl.create({
            duration: 1500,
            content: 'Carregando ...'
        }).present();
    }
}