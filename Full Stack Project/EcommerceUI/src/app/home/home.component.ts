import { Component } from '@angular/core';
import { SuggestedProduct } from '../model/models';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
suggestedProducts:SuggestedProduct[]=[
{
  banerimage:'Baner/Baner_Mobile.png',
  category:{
    id:1,
    category:'electronics',
    subCategory:'mobiles'
  },
},
{
  banerimage:'Baner/Baner_Laptop.png',
  category:{
    id:1,
    category:'Electronics',
    subCategory:'laptops'
  },
},{
  banerimage:'Baner/Baner_Chair.png',
  category:{
    id:1,
    category:'furniture',
    subCategory:'chairs'
  },
}
];
constructor() { }
ngOnInit(): void {}
}
