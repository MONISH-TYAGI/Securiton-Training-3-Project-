import { Component, OnInit,Input } from '@angular/core';
import { Category } from '../model/models';

@Component({
  selector: 'app-suggested-products',
  templateUrl: './suggested-products.component.html',
  styleUrl: './suggested-products.component.css'
})
export class SuggestedProductsComponent  implements OnInit{
  @Input() category:Category={
    id:0,
    category:'',
    subcategory:''
  };
@Input() class:number=3;
constructor() { } 
ngOnInit(): void {
  
}

}
