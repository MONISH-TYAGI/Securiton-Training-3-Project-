import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/models';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(private jwt:JwtHelperService) { }

applyDiscount(price:number,discount:number):number{
  let finalPrice=price-(price*discount/100);
  return finalPrice;
}
getUser():User{
  let token=this.jwt.decodeToken();
  console.log("token->"+JSON.stringify(this.jwt));
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
}
