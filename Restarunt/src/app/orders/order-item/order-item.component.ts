import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';


@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styles: []
})
export class OrderItemComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemComponent>, private itemservice: ItemService,
    private orderservice:OrderService) { }
  formData: OrderItem;
  itemList: Item[];
  isValid:boolean = true;
  newItemID:any;
  ngOnInit() {

    this.itemservice.getItemList().then(res => this.itemList = res as Item[]);

    if(this.data.OrderItemIndex == null){
      this.formData = {
        OrderItemID: null,
        OrderID: this.data.OrderID,
        ItemID: 0,
        Quntity: 0,
        ItemName: '',
        Price: 0,
        Total: 0
      }
    }else{
      this.formData = Object.assign({},this.orderservice.orderItems[this.data.OrderItemIndex]);
    }    
  }


  updatePrice(ctrl) {
    debugger;
    if (ctrl.selectedIndex == 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    } else {
    
      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].Name;
      this.newItemID =  this.itemList[ctrl.selectedIndex - 1].ItemID;
    }
    this.upateTotal();
  }

  upateTotal() {
    this.formData.Total = parseFloat((this.formData.Quntity * this.formData.Price).toFixed(2));
  }

  onSubmit(form:NgForm){
    form.value.ItemID = this.newItemID;
    if(this.validateForm(form.value))
    if(this.data.OrderItemIndex == null)    
      this.orderservice.orderItems.push(form.value);
      else
      this.orderservice.orderItems[this.data.OrderItemIndex] = form.value;
      this.dialogRef.close();
  
  }

  validateForm(formData:OrderItem){
    this.isValid = true;
    if(formData.ItemID == 0)
      this.isValid = false;
    else if(formData.Quntity == 0)
      this.isValid = false;    
    return this.isValid;
  }

}
