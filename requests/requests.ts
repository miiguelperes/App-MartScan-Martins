import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  diseases = [];
  shownGroup = null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loadRequest();
    this.loadRequest();
  }

  loadRequest(){
    this.diseases.push(
      { 
        pedido: "03992988",
        condicao: "111 - ANTECIPADO",
        filial: 374,
        total: 2300000.00,
        produtos:[
          {
            cod: 1002991,
            decricao: "Tintura Maxton Kit Prático 6.66 Vermelho Cereja(Emb. contém 1un.)",
            qntd: 12,
            valor: 12.90,
          },
          {
            cod: 1002992,
            decricao: "Tintura Maxton Kit Prático 6.66 Rosa Choque(Emb. contém 1un.)",
            qntd: 12,
            valor: 12.90,
          }
        ],
        statusDate: 
          { 
            venda: null,
            pagamento: "22/12",
            faturamento: "23/12",
            entrega: "28/12",
            finalizado: "28/12"
          }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };
  isGroupShown(group) {
      return this.shownGroup === group;
  };
  goToHome(){
    this.navCtrl.setRoot('HomePage', {}, {animate: true, direction: 'forward'});
  }
}
