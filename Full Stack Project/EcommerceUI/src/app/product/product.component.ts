import { Component,Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() view:'grid'|'list' = 'grid';
  constructor() { }
  ngOnInit(): void {
  }

}
