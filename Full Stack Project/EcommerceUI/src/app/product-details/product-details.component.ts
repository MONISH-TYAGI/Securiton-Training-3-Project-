import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';
import { Product, Review } from '../model/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
imageIndex:number=1;
product!:Product;
reviewControl=new FormControl('');
showError=false;
otherReviews:Review[]=[];
  reviewSaved: boolean = false;
constructor(
  private activatedRoute: ActivatedRoute,
  private navigationService: NavigationService,
  public utilityService: UtilityService
) { 

}
ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe((params: any) => {
    let id=params.id;
    console.log("id is "+id);
    this.navigationService.getProduct(id).subscribe((res:any)=>{
      console.log("res2"+res);
      console.log(JSON.stringify(res));
      this.product=res;
      this.fetchAllReviews();
    });
  });

}
 submitReview = () =>{
  let review=this.reviewControl.value;
  console.log("review is "+review)
  if(review===''||review===null)
    {
      this.showError=true;
      return ;
    }
    console.log(21000);
    let useridStr = this.utilityService.getUser().id;
    let userid = Number(useridStr);
      console.log(3);
    let productid=this.product.id;
    console.log("userid is "+userid+"productid is "+productid);
    this.navigationService.submitReview(userid,productid,review).subscribe((res:any)=>{
      this.reviewSaved=true;
      this.fetchAllReviews();
      this.reviewControl.setValue('');  
      console.log("res"+res);
    });    
}
fetchAllReviews = () =>{  
  this.otherReviews=[];
  this.navigationService.getAllReviewsOfProduct(this.product.id).subscribe((res:any)=>{
    for(let review of res)
    {
      console.log(review);
      this.otherReviews.push(review);
    }
    
});
}

}