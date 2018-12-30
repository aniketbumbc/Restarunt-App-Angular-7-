using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    public class OrderController : ApiController
    {
        private DBModel db = new DBModel();

        // GET: api/Order
        public System.Object GetOrders()
        {
            var result = (from a in db.Orders
                          join b in db.Customers on
     a.CustomerID equals b.CustomerID
                          select new
                          {
                              a.OrderID,
                              a.OrderNo,
                              Customer = b.Name,
                              a.Payement,
                              a.GTotal
                          }).ToList();

            return result;
        }

        // GET: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult GetOrder(long id)
        {
            //Order order = db.Orders.Find(id);

            var order = (from a in db.Orders
                         where a.OrderID == id
                         select new
                         {
                             a.OrderID,
                             a.OrderNo,
                             a.CustomerID,
                             a.Payement,
                             a.GTotal,
                             DeletedOrderItemsIDs = ""
                         }).FirstOrDefault();

            var orderDetails = (from a in db.OrderItems
                               join b in db.Items on a.ItemID equals b.ItemID
                               where a.OrderID == id
                               select new
                               {
                                   a.OrderID,
                                   a.OrderItemID,
                                   a.ItemID,
                                   ItemName = b.Name,
                                   b.Price,
                                   a.Quntity,
                                   Total = a.Quntity * b.Price
                               }).ToList();

            return Ok(new { order, orderDetails });


            
        }       
        // POST: api/Order
        [ResponseType(typeof(Order))]
        public IHttpActionResult PostOrder(Order order)
        {

            try
            {
                // insert operation for order table
                if (order.OrderID == 0)
                    db.Orders.Add(order);
                else
                    db.Entry(order).State = EntityState.Modified;
                
                //insert OrderItems table  
                foreach(var item in order.OrderItems)
                {
                    if(item.OrderItemID == 0)
                    db.OrderItems.Add(item);
                    else
                     db.Entry(item).State = EntityState.Modified;
                }
                //Delete for OrderItems

                foreach(var id in order.DeletedOrderItemsIDs.Split(',').Where(x=> x!= ""))
                {
                    OrderItem x = db.OrderItems.Find(Convert.ToInt64(id));
                    db.OrderItems.Remove(x);
                }

                //db.Orders.Add(order);
                db.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                throw ex;
            }

            
        }

        // DELETE: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult DeleteOrder(long id)
        {
            Order order = db.Orders.Include(y =>y.OrderItems).
                SingleOrDefault(x => x.OrderID == id);

            foreach(var item in order.OrderItems.ToList())
            {
                db.OrderItems.Remove(item);
            }

            db.Orders.Remove(order);
            db.SaveChanges();

            return Ok(order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderExists(long id)
        {
            return db.Orders.Count(e => e.OrderID == id) > 0;
        }
    }
}