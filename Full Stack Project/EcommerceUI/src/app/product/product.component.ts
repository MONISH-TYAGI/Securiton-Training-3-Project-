import { Component,Input,OnInit } from '@angular/core';
import { Product } from '../model/models';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  constructor(public utilityService: UtilityService) { } 
  @Input() view:'grid'|'list' | 'currcartItem' | 'prevcartItem'='grid';
  @Input() product:Product={
    id:0,
    title:'',
    description:'',
    price:0,
    quantity:0,
    productCategory:{
      id:1,
      category:'',
      subCategory:''
    },
    offer:{
      id:1,
      title:'',
      discount:0
    },
    imageName:''
  };

  ngOnInit(): void {
  }

}
