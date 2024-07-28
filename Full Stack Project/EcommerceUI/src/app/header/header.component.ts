import { Component ,OnInit, ViewChild, ViewContainerRef,ElementRef, Type} from '@angular/core';
import { Category, NavigationItem } from '../model/models';
import { LoginComponent } from '../cart/login/login.component';
import { RegisterComponent } from '../cart/register/register.component';
import { NavigationService } from '../services/navigation.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  @ViewChild('modalTitle') modalTitle!:ElementRef;
  @ViewChild('container',{read:ViewContainerRef,static:true})
  container!:ViewContainerRef;
navigationList:NavigationItem[]=[

];
 
constructor(private navigationService:NavigationService,public utilityService: UtilityService){}
ngOnInit(): void {
  this.navigationService.getCategoryList().subscribe((list:Category[])=>{
    console.log("hello header");  
    for(let item of list)
      {
      let present=false;
      for(let navItem of this.navigationList)
        {
          if(navItem.category===item.category)
            {
              navItem.subcategories.push(item.subCategory);
              present=true;
            }
        }
        if(!present)
          {
            this.navigationList.push({
              category:item.category,
              subcategories:[item.subCategory]
            });
          }
      }
      console.log("length"+this.navigationList.length)
    });
  
}
openModal(name:string)
{
this.container.clear();
let componentType!:Type<any>;
if(name==='login') 
  
  {componentType=LoginComponent;
    this.modalTitle.nativeElement.textContent='Enter Login Information';
  }
if(name==='register')
  { 
  componentType=RegisterComponent;
  this.modalTitle.nativeElement.textContent='Enter Register Information';
  }
this.container.createComponent(componentType)
}
}
