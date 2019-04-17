import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, Keyboard, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';

import { Cart } from '../../model/cart';
import { CartServiceProvider } from '../../providers/cart-service/cart-service';
import { FormControl } from '@angular/forms';
import { SuperTabsController } from 'ionic2-super-tabs';

import { CartItem } from '../../model/cart-item';
import { Utils } from '../../providers/common/utils';
//import {Product} from "../../model/product";
//import { isRightSide } from 'ionic-angular/umd/util/util';

const STORAGE_KEY = "11239580000190";

@IonicPage()

@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})

export class ListPage {
    @ViewChild(Content) content: Content;

    form: FormGroup;
    isNew = true;
    isKeyboardHide: boolean = true;
    add_str: string = 'Adicionar';

    //private cart = Cart;
    //public pedidos: Pedido[] = [];

    private products:any;    
    private items = [];
    private cart: Cart;

    strArla: string='';
    shouldShowCancel:boolean;
    searchTerm : FormControl = new FormControl();

    itemCart: CartItem[] = [];

    constructor(
        platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private keyboard: Keyboard,
        private loadingCtrl: LoadingController,
        private cartService: CartServiceProvider,
        private storage: Storage,
        private superTabsCtrl: SuperTabsController,
        private fb: FormBuilder,
        private utils: Utils
    ) {
        this.searchTerm.valueChanges.debounceTime(400).subscribe(then=>{
            console.log(then);
            //this.searchString  =  then;
            this.findProduct(then);
        });

        this.form = this.fb.group({
            qtd_item: ['', Validators.required]
        });
    }

    gotocart(){
        this.superTabsCtrl.slideTo(2);
    }

    isArray(obj : any ) {
        return Array.isArray(obj)
     }

    findProduct(strtitle: string) {
        for (var e = 0; e < this.products.length; e++) {
            this.products[e].visible = true;
        }
        strtitle = strtitle.toLowerCase();
        if(strtitle!='') {
            for (var i = 0; i < this.products.length; i++) {
                let nam = this.products[i].nome;
                nam = nam.toLowerCase();
                if(nam.indexOf(strtitle) != -1) {
                    //console.log('result:'+ nam);
                } else {
                    this.products[i].visible = false;
                }
            }
        } else {
            for (var e = 0; e < this.products.length; e++) {
                this.products[e].visible = true;
            }
        }
    }
    
    ionViewWillEnter() {
        this.products = this.navParams.data.products;
        //console.log("Prods. Lista: " + JSON.stringify(this.products));
        //this.items = this.storage.get('prodArray').then((val) => { this.items = val;});
    }
/*
    addCart(item: any) {
        if (!this.form.valid) {
            return;
        }

        let _qtd_item = this.form.value;
        let result   = Object.assign({}, _qtd_item, item);
        this.itemCart = [result];

        console.log(this.itemCart);

        this.getStorageItems()
            .then(result => {
                if (result) {
                    result.push(this.itemCart)
                    return this.utils.set(STORAGE_KEY, result);
                } else {
                    return this.utils.set(STORAGE_KEY, [this.itemCart]);
                }
            });
    }
*/
    addToCart(product) {
        this.storage.get("cart").then((data) => {
            if (data == null || data.length == 0) {
                data = [];
    
                data.push({
                    "_codigo":            product._codigo,
                    "_codigo_ean":        product._codigo_ean,
                    "_estoque":           product._estoque,
                    "_frete":             product._frete,
                    "_freteCaixaFechada": product._freteCaixaFechada,
                    "_imagem":            product._imagem,
                    "_multiplo":          product._multiplo,
                    "_nome":              product._nome,
                    "_preco":             product._preco,
                    "_precoCaixaFechada": product._precoCaixaFechada,
                    "_qtdCaixaFechada":   product._qtdCaixaFechada,
                    "_qtdMinimaVenda":    product._qtdMinimaVenda,
                    "_qty":               1,
                    "_amount":            parseFloat(product._preco)
                })
            } else {
                let added = 0;
        
                for (let i = 0; i < data.length; i++) {
                    if (product._codigo == data[i]._codigo) {
                        let qty = data[i]._qty;
            
                        console.log("Product is already in the cart");
            
                        data[i]._qty = qty + 1;
                        data[i]._amount = parseFloat(data[i]._amount) + parseFloat(data[i]._preco);
                        added = 1;
                    }
                }
        
                if (added == 0) {
                    data.push({
                        "_codigo":            product._codigo,
                        "_codigo_ean":        product._codigo_ean,
                        "_estoque":           product._estoque,
                        "_frete":             product._frete,
                        "_freteCaixaFechada": product._freteCaixaFechada,
                        "_imagem":            product._imagem,
                        "_multiplo":          product._multiplo,
                        "_nome":              product._nome,
                        "_preco":             product._preco,
                        "_precoCaixaFechada": product._precoCaixaFechada,
                        "_qtdCaixaFechada":   product._qtdCaixaFechada,
                        "_qtdMinimaVenda":    product._qtdMinimaVenda,
                        "_qty":               1,
                        "_amount":            parseFloat(product._preco)
                    })
                }
            }
    
            this.storage.set("cart", data).then(() => {
                console.log("Carrinho foi atualizado");
                console.log(data);
        
                this.utils.showToast("Produto adicionado ao Carrinho");
            })
        })
    }
 /*   
    delStorageItems() {
        //this.utils.clear();
        this.utils.showAlert("Total de Itens: " + this.getCountItems());
    }

    getStorageItems() {
        return this.utils.get(STORAGE_KEY);
    }

    getCountItems() {
        return [this.utils.get(STORAGE_KEY)].length;
    }
*/

    scanNow(){
        this.slideToIndex(0);
    }

    slideToIndex(index: number) {
        //this.superTabsCtrl.showToolbar(false);
        this.superTabsCtrl.slideTo(index);
    }
    getProd(){
       console.log();
    }

    showLoading() {
        this.loadingCtrl.create({
            duration: 1500,
            content: 'Carregando ...'
        }).present();
    }

    clearlist(){
        this.products = [];
    }

    buttonAdd(item: any, qtd: number) {
        
        /*
        let prod = new Product(item._codigo, item._codigo_ean, item._estoque, item._frete, item._freteCaixaFechada, item._imagem, item._multiplo, item._nome, item._preco, item._precoCaixaFechada, item._qtdCaixaFechada, item._qtdMinimaVenda);
        //console.log(item._codigo + " " + item._codigo_ean);
        //debugger;

        let cart_item = new Cart(prod)


        console.log()

        let item_cart = new this.cart.setProduct(prod, qtd);

        console.log("Item Cart:" + JSON.stringify(item_cart));
        debugger;
        */
        /*
        this.items.forEach(function (value) {
            if(value.id == id){
                if(!value.btn)
                    value.btn = true;
                else
                    value.btn = false;
            }
        });
        */
    }

    /*
    addCart(){
        if(sessionStorage.getItem('cart')){
          console.log(sessionStorage.getItem('cart'))
          this.cart = JSON.parse(sessionStorage.getItem('cart'));
          //Zera o carrinho se ele estiver vazio
          console.log(this.pedidos.length)
          if(!this.pedidos){
            console.log("entrou no if ==0")
             this.cart = new Cart(null,null,null,null,null,null,null,null);
          }
        }
        else{
          console.log("Carrinho vazio");
        } 
        //Adicionando primeiro item ao carrinho
         if(this.cart.pedidos==null || this.cart.pedidos.length == 0){ 
         this.pedido.quantidade = 1;
             this.pedidos[0] = this.pedido;
             this.cart.pedidos = this.pedidos;
             this.cart.valor_total = this.pedido.cardapio.preco;
             this.cart.taxa_entrega = 10.50;
             this.cart.usuario = sessionStorage.getItem('usuarioId');
             this.cart.email = sessionStorage.getItem('usuarioLogado');
             sessionStorage.setItem("cart", JSON.stringify(this.cart));
         }else
         if(this.cart.pedidos.length>0){
         // Adicionando segundo item ao carrinho
         let flag=true;
         // Verificando se está repetido
             this.cart.pedidos.forEach((cardapio) => {
                 console.log(cardapio);
                 if(cardapio.cardapio.id == this.pedido.cardapio.id){
                     console.log("pedido já se encontra no carrinho");
                     flag=false;
                 }
         });
             // Caso não seja repetido insere novo item ao carrinho
             if(flag){
           this.pedido.quantidade = 1;
                 let arrayIndex = this.cart.pedidos.length;
                 this.cart.valor_total = this.cart.valor_total*1 + this.pedido.cardapio.preco*1;
                 this.cart.pedidos[arrayIndex] = this.pedido;
                 sessionStorage.setItem("cart", JSON.stringify(this.cart));
             }	
             console.log(sessionStorage.getItem('cart'))
       }
       this.navCtrl.setRoot(CartPage);
       }
       */
}


