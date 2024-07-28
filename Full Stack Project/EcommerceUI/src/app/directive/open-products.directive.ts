import { Directive, HostListener, Input } from '@angular/core';
import { Category } from '../model/models';
import { query } from '@angular/animations';
import { Router } from '@angular/router';
@Directive({
  selector: '[OpenProducts]'
})
export class OpenProductsDirective {
@Input() category:Category={
id:0, 
category:'',  
subCategory:''
};
@HostListener('click') openProducts(){
  
  this.router.navigate(['/products'],{
    queryParams:{
      category:this.category.category,
      subcategory:this.category.subCategory
    },
  });
}
  constructor(private router:Router) { }

}
