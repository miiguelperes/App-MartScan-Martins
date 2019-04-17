import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Utils } from "../../providers/common/utils";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from "../home/home";
import { MenuController } from 'ionic-angular';

@IonicPage()

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  form: FormGroup;
  keyboardOpen: boolean = false;
  user: any;
  userB2B: any;
  userMrkt: any;
  identity: any;
    isLogged: boolean = false;
  constructor (
    public  navCtrl: NavController,
    public  navParams: NavParams,
    private auth: AuthServiceProvider,
    private utils: Utils,
    private fb: FormBuilder,
    public menu: MenuController
  ) {
    this.menu.close();



    this.form = this.fb.group({
      cnpj: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      isLogged: [false]
    });
  }

  login() {
    this.loginMrkt();
    //this.loginB2BIos();
  }
  ionViewDidEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

  loginMrkt() {
    if (!this.form.valid) {
      return;
    }
    
    this.utils.showLoading();

    let { email, cnpj, password, isLogged } = this.form.value;
    cnpj = this.utils.replaceChars(cnpj);

    this.auth.authenticateMrkt(email, cnpj, password).subscribe((data: any) => {

      if (data.status != 0) {
        this.utils.hideLoading();
        this.utils.showToast('CNPJ e/ou Senha incorretos', 'danger');

        return;
      } else {
        this.userMrkt = (data);
        this.utils.hideLoading();
  
        setTimeout(() => {
          this.loginParceiro();
        }, 1000);
      }
    }, (error: any) => {
      this.utils.hideLoading();
      this.utils.showToast('CNPJ e/ou senha incorretos', 'danger');
    });
  }

  loginParceiro() {
    if (!this.form.valid) {
      return;
    }

    this.utils.showLoading();

    let { cnpj, email } = this.form.value;
    cnpj = this.utils.replaceChars(cnpj);

    this.auth.authenticateB2B(cnpj, email).subscribe((data: any) => {
      console.log(data);

      if (data.Status != 0) {
        this.utils.hideLoading();
        this.utils.showToast('CNPJ e/ou Email incorretos 1', 'danger');

        return;
      } else {
        this.user    = {"cnpj": cnpj, "email": email, "isLogged": this.isLogged};
        this.userB2B = (data.Login);
        let result   = Object.assign({}, this.user, this.userMrkt, this.userB2B);

        let identity = this.utils.extractIdentity(result);
        this.auth.setIdentity(identity);

        this.utils.hideLoading();
        this.utils.showToast('Login efetuado com sucesso.', 'success');
  
        setTimeout(() => {
          this.goHomePage();
        }, 1000);
      }
    }, (error: any) => {
      this.utils.hideLoading();
      this.utils.showAlert("Erro: " + JSON.stringify( error ));
      this.utils.showToast('CNPJ e/ou Email incorretos 2', 'danger');
    });
  }

  /*
  loginB2BIos() {
    if (!this.form.valid) {
      return;
    }

    this.utils.showLoading();

    let { cnpj, email } = this.form.value;
    cnpj = this.utils.replaceChars(cnpj);

    console.log(cnpj + " - " + email);

    this.auth.authenticateB2BIos(cnpj, email).then((data: any) => {
      console.log(JSON.stringify(data));

      console.log("Status: " + JSON.stringify(data.Status));

      if (data.Status != 0) {
        this.utils.hideLoading();
        this.utils.showToast('CNPJ e/ou Email incorretos 1', 'danger');

        return;
      } else {

        //this.user    = {"cnpj": cnpj, "email": email}; 
        //this.userB2B = (data.Login);
        //let result   = Object.assign({}, this.user, this.userMrkt, this.userB2B);

        //this.utils.showAlert( JSON.stringify(result) );
  
        //let identity = this.utils.extractIdentity(result);
        //this.auth.setIdentity(identity);

        this.utils.hideLoading();
        this.utils.showToast('Login efetuado com sucesso.', 'success');
  
        setTimeout(() => {
          this.goHomePage();
        }, 1000);
      }
    }, (error: any) => {
      this.utils.hideLoading();
      this.utils.showToast('CNPJ e/ou Email incorretos 2: ' + error, 'danger');
    });
  }
*/

  goHomePage(): void {
    this.navCtrl.setRoot(HomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }
}
