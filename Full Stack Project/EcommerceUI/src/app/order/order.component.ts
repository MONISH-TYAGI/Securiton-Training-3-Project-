import { Component ,OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, Order, Payment, PaymentMethod } from '../model/models';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent  implements OnInit{
selectedPaymentMethodName=''; 
address = '';
mobileNumber = '';
displaySpinner = false;
message = '';
classname = ''; 
selectedPaymentMethod=new FormControl('0');
paymentMethods:PaymentMethod[]=[];
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
constructor(
  private navigationService:NavigationService,
  private utilityService:UtilityService,
  private router: Router
  
){}
ngOnInit():void{
 //get payment methods
 this.navigationService.getPaymentMethods().subscribe((res:any)=>{
  this.paymentMethods=res;
 });

  this.selectedPaymentMethod.valueChanges.subscribe((res:any)=>{
    if(res==='0') this.selectedPaymentMethodName='';
    else this.selectedPaymentMethodName=res.toString();

});
this.navigationService.getActiveCartOfUser(this.utilityService.getUser().id).subscribe((res:any)=>{
  console.log("res"+res);
  console.log("res"+JSON.stringify(res));
  this.UsersCart=res;
   // Calculate Payment
   this.utilityService.calculatePayment(
    this.UsersCart,
    this.usersPaymentInfo
  );
     // Set address and phone number
     this.address = this.utilityService.getUser().address;
     this.mobileNumber = this.utilityService.getUser().mobile;
});


}
getPaymentMethod(id:string)
{
 let x=this.paymentMethods.find((p)=>p.id===parseInt(id));
 return x?.type+'-'+x?.provider;
}
placeOrder()
{
  this.displaySpinner = true;
  let isPaymentSuccessfull = this.payMoney();

  if (!isPaymentSuccessfull) {
    this.displaySpinner = false;
    this.message = 'Something went wrong! Payment did not happen!';
    this.classname = 'text-danger';
    return;
  }

  let step = 0;
  let count = timer(0, 3000).subscribe((res) => {
    ++step;
    if (step === 1) {
      this.message = 'Processing Payment';
      this.classname = 'text-success';
    }
    if (step === 2) {
      this.message = 'Payment Successfull, Order is being placed.';
      this.storeOrder();
    }
    if (step === 3) {
      this.message = 'Your Order has been placed';
      this.displaySpinner = false;
    }
    if (step === 4) {
      this.router.navigateByUrl('/home');
      count.unsubscribe();
    }
  });
}
payMoney()
{
  return true;
}
storeOrder()
{
  let payment: Payment;
  let pmid = 0;
  if (this.selectedPaymentMethod.value)
    pmid = parseInt(this.selectedPaymentMethod.value);

  payment = {
    id: 0,
    paymentMethod: {
      id: pmid,
      type: '',
      provider: '',
      available: false,
      reason: '',
    },
    user: this.utilityService.getUser(),
    totalAmount: this.usersPaymentInfo.totalAmount,
    shippingCharges: this.usersPaymentInfo.shippingCharges,
    amountReduced: this.usersPaymentInfo.amountReduced,
    amountPaid: this.usersPaymentInfo.amountPaid,
    createdAt: '',
  };

  this.navigationService
    .insertPayment(payment)
    .subscribe((paymentResponse: any) => {
      payment.id = parseInt(paymentResponse);
      let order: Order = {
        id: 0,
        user: this.utilityService.getUser(),
        cart: this.UsersCart,
        payment: payment,
        createdAt: '',
      };
      this.navigationService.insertOrder(order).subscribe((orderResponse) => {
        this.utilityService.changeCart.next(0);
      });
    });
}
}
