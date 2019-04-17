import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Toast } from 'ionic-angular';
import { Utils } from "../../providers/common/utils";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { SuperTabsController, SuperTabs } from "ionic2-super-tabs";
import { ListPage } from "../list/list";
import { Storage } from '@ionic/storage';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { ENV } from '@app/env';

@IonicPage()

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})

export class ScanPage {
    products: Array<any>;
    num_cnpj: number;
    identity: any;
    text: string = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna';
    rootNavCtrl: NavController;
    page2: any = ListPage;
    
    public codProds: any;
    private urlLocl: string;
 
    @ViewChild(SuperTabs) superTabs: SuperTabs;

    constructor(
      public  navCtrl: NavController,
      public  navParams: NavParams,
      private loadingCtrl: LoadingController,
      public  utils: Utils,
      private superTabsCtrl: SuperTabsController,
      public  auth: AuthServiceProvider,
      private barcodeScan: BarcodeScanner,
      public  productProvider: ProductServiceProvider,
      private http: HttpClient,
      private storage: Storage
    ) {
        this.rootNavCtrl = navParams.get('rootNavCtrl');
        this.identity = this.auth.getIdentity();
        this.num_cnpj = this.identity.num_cnpj;
        this.urlLocl = ENV.API_LOCL;
    }

    pushPage(localNavCtrl: boolean = false) {
      if (localNavCtrl) {
          this.navCtrl.push('CheckoutPage');
      } else {
          this.rootNavCtrl.push('CheckoutPage');
      }
    }

    ionViewDidEnter() {
        
    }

    showLoading() {
      this.loadingCtrl.create({
          duration: 1500,
          content: 'Carregando ...'
      }).present();
    }

    showList() {
        var codGrup: string;
        var self = this;

        codGrup = "3149";

        this.utils.showLoading();
        if (codGrup != '0') {
            this.http.get(this.urlLocl + 'mercadorias_por_agrupamento?cod_agrupamento=' + codGrup)
            .subscribe(data => {
                this.codProds = data;

                this.productProvider.getProducts( this.codProds )
                    .filter(item => item._estoque = true)
                    .subscribe(prods => {
                        self.navParams.data.products = prods.filter( items => {
                            return items._estoque = true;
                        })
                        .filter( items => {
                            return items._preco > 0;
                        });
                        this.slideToIndex(1);
                        this.utils.hideLoading();
                    });
            });
        }
    }
  
    slideToIndex(index: number) {
        //this.superTabsCtrl.showToolbar(false);
        this.superTabsCtrl.slideTo(index);
    }

    scan() {
        var codProd: string;
        var codGrup: string;
        var self = this;

        this.barcodeScan
            .scan()
            .then((barcodeData) => {
                var array = barcodeData.text.split(",");
                codProd   = array[0];
                codGrup   = array[1];

                this.utils.showLoading();
                if (codGrup != '0') {
                    this.http.get(this.urlLocl + 'mercadorias_por_agrupamento?cod_agrupamento=' + codGrup)
                    .subscribe(data => {
                        this.codProds = data;

                        this.productProvider.getProducts( this.codProds )
                            .subscribe(prods => {
                                self.navParams.data.products = prods.filter( items => {
                                    return items._estoque = true;
                                }).filter( items => {
                                    return items._preco > 0;
                                });
                                this.slideToIndex(1);
                                this.utils.hideLoading();
                            });
                    });
                } else {
                    this.productProvider.getProducts( [codProd] )
                    .subscribe(prods => {
                        self.navParams.data.products = prods.filter( items => {
                            return items._estoque = true;
                        }).filter( items => {
                            return items._preco > 0;
                        });
                        this.slideToIndex(1);
                        this.utils.hideLoading();
                    });
                }
            });
    }
}



