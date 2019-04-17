import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabsController, SuperTabs } from "ionic2-super-tabs";
import { ScanPage } from "../scan/scan";
import { ListPage } from "../list/list";
import { CartPage } from "../cart/cart";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage({
  segment: 'home/:type'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  identity: any;
  params: any = [];

  pages = [
    { pageName: 'ScanPage', title: 'SCANEAR CÓDIGO', icon: 'custom-scan-icon', id: 'ScanTab'},
    { pageName: 'ListPage', title: 'LISTA DE PRODUTO(S)', icon: 'custom-list-icon', id: 'ListTab'},
    { pageName: 'CartPage', title: 'CARRINHO DE COMPRAS', icon: 'custom-cart-icon', id: 'CartTab'}
  ];

  @ViewChild(SuperTabs) superTabs: SuperTabs;

  page1: any = ScanPage;
  page2: any = ListPage;
  page3: any = CartPage;

  showIcons: boolean = true;
  showTitles: boolean = false;
  pageTitle: string = 'SCANEAR CÓDIGO';

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private superTabsCtrl: SuperTabsController,
    private auth: AuthServiceProvider,
    //private qrscan: ScanPage
  ) {
    this.params.products = [];
    this.identity = this.auth.getIdentity();
    this.params.tabs = this.pages;
  }
  ngAfterViewInit() {
    
  }
  slideToIndex(index: number) {
    //this.superTabsCtrl.showToolbar(false);
    this.superTabsCtrl.slideTo(index);
  }
  clickIcTab(id:any){
    console.log(id);
  }
  onTabSelect(tab: { index: number; id: string; }) {
    switch (tab.index) {
      case 0:
        this.pageTitle = 'SCANEAR CÓDIGO';
        break;
      case 1:
        this.pageTitle = 'LISTA DE PRODUTO(S)';
        break;
      case 2:
        this.pageTitle = 'CARRINHO DE COMPRAS';
        break;
    }
  }
}
