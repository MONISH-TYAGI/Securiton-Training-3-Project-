import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { Product } from '../model/models';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
view:'grid'|'list' = 'list';
sortby:'default'|'htl'|'lth' = 'default';
products:Product[]=[];
constructor(
  private activatedRoute:ActivatedRoute,
  private navigationService:NavigationService,
  private utilityService:UtilityService
){}
ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe((params:any)=>{
    let category=params.category;
    let subCategory=params.subcategory;
    console.log("category"+category+"subCategory"+subCategory);
    if(category&&subCategory)
      {
        console.log("category"+category+"subCategory"+subCategory);
        this.navigationService.getProducts(category,subCategory,10).subscribe((res:any[])=>
          {
            console.log("res"+res);
           
            this.products=res;
            for(let product of this.products)
              {
                console.log("product"+JSON.stringify(product.productCategory.category));
              }
          
          });
      }

});
}
sortByPrice(sortKey:string)
{
 this.products.sort((a,b)=>{
  if(sortKey==='default')
  {
return a.id>b.id?1:-1;
  } if(sortKey==='htl')
      {
     return this.utilityService.applyDiscount(a.price,a.offer.discount)>
      this.utilityService.applyDiscount(b.price,b.offer.discount)?-1:1;
      }
    if(sortKey==='lth')
      {
      return  this.utilityService.applyDiscount(a.price,a.offer.discount)>
        this.utilityService.applyDiscount(b.price,b.offer.discount)?1:-1;
      }
    return 0;
  });
}

}
