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
    subcategory:'mobiles'
  },
},
{
  banerimage:'Baner/Baner_Laptop.png',
  category:{
    id:1,
    category:'Electronics',
    subcategory:'laptops'
  },
},{
  banerimage:'Baner/Baner_Chair.png',
  category:{
    id:1,
    category:'furniture',
    subcategory:'chairs'
  },
}
];
constructor() { }
ngOnInit(): void {}
}
