import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router class
import { UtilityService } from '../services/utility.service';
import { NavigationService } from '../services/navigation.service';
import { Cart, Payment } from '../model/models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
UsersCart:Cart={
  id:0,
  user:this.utilityService.getUser(),
  cartItems:[],
  ordered:false,
  orderedOn:'',
};


usersPaymentInfo:Payment={
  id:0,
  user:this.utilityService.getUser(),
  paymentMethod:{
    id:0,
    type:'',
    provider:'',
    available:false,
    reason:''
  },
  totalAmount:0,
  shippingCharges:0,
  amountReduced:0,
  amountPaid:0,
  createdAt:''
}
usersPreviousCarts:Cart[]=[];
constructor(public utilityService:UtilityService,
private navigationService:NavigationService,
private router: Router) { }

ngOnInit(): void {
  console.log("cart component");
  console.log(this.utilityService.getUser().id);  
  this.navigationService.getActiveCartOfUser(this.utilityService.getUser().id).subscribe((res:any)=>{
    console.log("res"+res);
    console.log("res"+JSON.stringify(res));
    this.UsersCart=res;

    
        // Calculate Payment
        this.utilityService.calculatePayment(
          this.UsersCart,
          this.usersPaymentInfo
        );

        //Get Previous Carts
        this.navigationService.getAllPreviousCarts(this.utilityService.getUser().id).subscribe((res:any)=>{
          console.log("userPreviousCarts"+res);
          this.usersPreviousCarts=res;
        });
  });
}
}
