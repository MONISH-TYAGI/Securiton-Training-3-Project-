import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category, Order, Payment, PaymentMethod, User } from '../model/models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
baseUrl="https://localhost:7254/api/Shopping/"
  constructor(private http:HttpClient) { }
  getCategoryList()
  {
    let url=this.baseUrl+'GetCategoryList';
    return this.http.get<any[]>(url).pipe(
      map((categories: any[])=>
        categories.map((category)=>{
          let mappedCategory:Category={
            id: category.id,
            category: category.category,
            subCategory: category.subCategory,
          
          };
          return mappedCategory;
        })
      
      )
    );
  }
  getProducts(category:string,subcategory:string,count:number)
  {
    return this.http.get<any[]>(this.baseUrl+'GetProducts',{
      params:new HttpParams().set('category',category).set('subcategory',subcategory).set('count',count)
    })
  }
  getProduct(id:number)
  {
    let url=this.baseUrl+'GetProduct/'+id;
    return this.http.get(url);
  }
  registerUser(user:any)
  {
    let url=this.baseUrl+'RegisterUser';
    console.log(url);
    return this.http.post(url,user,{responseType:'text'});
  }
  loginUser(email:string,password:string)
  {
    console.log("loginUser")
    let url=this.baseUrl+'LoginUser';
    console.log(url)
    return this.http.post(
      url,
      { Email: email, Password: password },
      { responseType: 'text' }
    );
  }
  
  setUser(token:string)
  {
    localStorage.setItem('user',token);
  }
  submitReview(userid:number,productid:number,review:string)
  {
    let obj = {
      user: {
        id: userid,
        firstName: '',  // Add other required fields or ensure they are not null
        lastName: '',
        email: '',
        address: '',
        mobile: '',
        password: '',
        createdAt: '',
        modifiedAt: ''
      },
      product: {
        id: productid,
        title: '',
        description: '',
        productCategory: {
          id: 0,
          category: '',
          subCategory: ''
        },
        offer: {
          id: 0,
          title: '',
          discount: 0
        },
        price: 0,
        quantity: 0,
        imageName: ''
      },
      value: review,
      createdAt: ''
    };

    let url = this.baseUrl + 'InsertReview';
    return this.http.post(url, obj, { responseType: 'text' });
  //  return resp;
  }

  getAllReviewsOfProduct(productId:number)
{
  let url=this.baseUrl+'GetProductReviews/'+productId;
  return this.http.get(url);
}

addToCart(userId:number,productId:number)
{
  let url=this.baseUrl+'InsertCartItem/'+ userId+'/'+productId;
  return this.http.post(url,{responseType:'text'});
}
getActiveCartOfUser(userid:number)
{
  let url=this.baseUrl+'GetActiveCartOfUser/'+userid;
  return this.http.get(url);
}
getAllPreviousCarts(userid:number)
{
  let url=this.baseUrl+'GetAllPreviousCartsOfUser/'+userid;
  return this.http.get(url);
}

getPaymentMethods()
{
  let url=this.baseUrl+'GetPaymentMethods';
  return this.http.get<PaymentMethod[]>(url);
}
insertPayment(payment:Payment)
{
  return this.http.post(this.baseUrl+'InsertPayment',payment,
    {
      responseType:'text'
    }
  );
}
insertOrder(Order:Order)
{
  return this.http.post(this.baseUrl+'InsertOrder',Order,
    {
      responseType:'text'
    }
  );
}

  } 



