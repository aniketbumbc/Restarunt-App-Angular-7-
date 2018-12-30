import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http:HttpClient) { }

  // API call to get all items from API
  getItemList(){

   return this.http.get(environment.apiURL+'/Item').toPromise();
  }
}
