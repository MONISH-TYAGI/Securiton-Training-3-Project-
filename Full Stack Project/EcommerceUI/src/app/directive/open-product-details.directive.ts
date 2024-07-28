import { query } from '@angular/animations';
import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[OpenProductDetails]'
})
export class OpenProductDetailsDirective {
@Input() productId:number=0;

@HostListener('click') openProductDetails(){
  window.scrollTo(0,0);
  console.log("OpenProductDetailsDirective");

  this.router.navigate(['/product-details'],{
    queryParams:{
      id:this.productId,
    },
  });
}
  constructor(private router:Router) { }

}
