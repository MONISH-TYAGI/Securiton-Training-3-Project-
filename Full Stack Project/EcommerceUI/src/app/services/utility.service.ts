import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavigationService } from './navigation.service';
import { Cart, Payment, Product, User } from '../model/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  changeCart= new Subject();
  constructor(private jwt:JwtHelperService,
    private navigationService: NavigationService,
  ) { }

applyDiscount(price:number,discount:number):number{
  let finalPrice=price-(price*discount/100);
  return finalPrice;
}
getUser():User{
  let token=this.jwt.decodeToken();
  console.log("token->"+JSON.stringify(token));
  console.log("token->"+token);
  let user:User={
 id:token.id,
  firstName:token.firstName,
  lastName:token.lastName,
   email:token.email,
  address:token.address,
  mobile:token.mobile,
  password:token.password,
  createdAt:token.createdAt,
  updatedAt:token.modifiedAt,
  };
  console.log("user->"+JSON.stringify(user));
  return user;
}
setUser(token:string)
{
  localStorage.setItem('user',token);
}
isLoggedIn(){
  return localStorage.getItem('user')?true:false;
}
logoutUser(){
  localStorage.removeItem('user');
}
addToCart(product:Product){
  let productid=product.id;
  let userid=this.getUser().id;
  this.navigationService.addToCart(userid,productid).subscribe((res:any)=>{
    console.log("res"+res);
    if(res==true)
      this.changeCart.next(1);
  });
}
calculatePayment(cart:Cart,payment:Payment)
{
  payment.totalAmount=0;
  payment.amountPaid=0;
  payment.amountReduced=0;
  
  for(let cartitem of cart.cartItems)
  {
    payment.totalAmount+=cartitem.product.price;
    payment.amountReduced+=cartitem.product.price-this.applyDiscount(cartitem.product.price,cartitem.product.offer.discount);
    payment.amountPaid+=this.applyDiscount(cartitem.product.price,cartitem.product.offer.discount);
  }
  if(payment.amountPaid>50000) payment.shippingCharges=2000;
  else if(payment.amountPaid>20000) payment.shippingCharges=1000;
  else if(payment.amountPaid>5000) payment.shippingCharges=500;
  else payment.shippingCharges=200;
}

calculatePricePaid(cart: Cart) {
  let pricepaid = 0;
  for (let cartitem of cart.cartItems) {
    pricepaid += this.applyDiscount(
      cartitem.product.price,
      cartitem.product.offer.discount
    );
  }
  return pricepaid;
}
}
