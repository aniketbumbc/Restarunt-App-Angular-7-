import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  orderList;

  constructor(private service: OrderService,
    private route: Router, private toster: ToastrService) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.service.getOrderList().then(res => this.orderList = res);
  }
  openForEdit(orderID: number) {
    this.route.navigate(['/order/edit/' + orderID])
  }

  orderDeleteById(id: number) {
    if (confirm('Are you sure Delete')) {
      this.service.deleteOrderByIdS(id).then(res => {
        this.refreshList();
        this.toster.warning("Delete Sucessfully", "Restaurant App");
      })
    }
  }
}
