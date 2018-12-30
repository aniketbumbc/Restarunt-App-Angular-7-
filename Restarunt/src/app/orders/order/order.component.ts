import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { OrderItem } from 'src/app/shared/order-item.model';
import{OrderItemComponent} from 'src/app/orders/order-item/order-item.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Customer } from 'src/app/shared/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

  customerList:Customer[];
  isValid:boolean = true;

  constructor(private service:OrderService, private dialog:MatDialog,
    private customerservice:CustomerService,
    private toasterservice:ToastrService,
    private router:Router,
    private currentRoute:ActivatedRoute) { }

  ngOnInit() {
    //get router ID from another route
    let orderID = this.currentRoute.snapshot.paramMap.get('id');
    if(orderID == null)
    this.resetForm();
    else
   this.service.getOrderById(parseInt(orderID)).then(res =>{
     this.service.formData = res.order;
     this.service.orderItems = res.orderDetails;
   } )
    this.customerservice.getCustomerList().then(res => this.customerList = res as Customer[]);

  }

  resetForm(form?:NgForm){
    if(form != null)
    form.resetForm();
    this.service.formData={
      OrderID:null,
      OrderNo:Math.floor(1000+Math.random()*90000).toString(),
      CustomerID:0,
      Payement:'',
      GTotal:0,
      DeletedOrderItemsIDs:''
    };
    this.service.orderItems=[];
  }

  AddOrEditOrderItem(OrderItemIndex,OrderID){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {OrderItemIndex,OrderID};
    this.dialog.open(OrderItemComponent,dialogConfig).afterClosed().subscribe(res=>{
      this.updateGrandTotal();
    });
  }
  onDeleteOrderItem(OrderItemID:number,index:number){
    if(OrderItemID !=null)
    this.service.formData.DeletedOrderItemsIDs += OrderItemID +",";
    this.service.orderItems.splice(index,1);
    this.updateGrandTotal();
  }
  updateGrandTotal(){
    this.service.formData.GTotal =this.service.orderItems.reduce((prev,curr)=>{
      return prev+curr.Total;
    },0);
    this.service.formData.GTotal = parseFloat((this.service.formData.GTotal).toFixed(2));
  }

  validateForm(){
    this.isValid = true;
    if(this.service.formData.CustomerID == 0)
    this.isValid = false;
    else if (this.service.orderItems.length == 0)
    this.isValid = false;
    return this.isValid;
  }

  onSubmit(form:NgForm){
    if(this.validateForm()){

      this.service.saveUpdateOrder().subscribe(res=>{
        this.resetForm();
        this.toasterservice.success('Have A Fun','Restaurant App');
        this.router.navigate(['/orders']);
      })
    }
  }
  

}
