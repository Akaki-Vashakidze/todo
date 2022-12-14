import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from './item.model';
import { map, catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ItemsService {
  baseUrl = environment.baseUrl;
  items: Item[] = [];
  itemsUpdated$ = new Subject<Item[]>();

  constructor(private httpClient: HttpClient) {}

  setItems() {
    localStorage.setItem('todos', JSON.stringify(this.items));
  }

  getItems(): Observable<Item[]> {
    return this.httpClient.get(`${this.baseUrl}/todos.json`).pipe(
      map((response) => {
        if (response) {
          const todoArray = [];
          for (let key in response) {
            todoArray.push({ ...response[key], key: key });
          }
          console.log(todoArray);
          return todoArray;
        } else {
          return [];
        }
      }),
      tap((items) => {
        this.items = items;
      })
    );
  }

  addItems(newItemDesc: string) {
    const newItem = {
      description: newItemDesc,
      done: false,
    };
    //ლინკის მერე წერ  - /სახელი.json
   return this.httpClient
      .post(`${this.baseUrl}/todos.json`, newItem)
      .pipe(
        tap((response: { name: string }) => {
          if (response) {
            this.items.push({...newItem, key:response.name});
            this.itemsUpdated$.next(this.items)
          }
        })
      )
  }

  deleteItem(key:string) {
    return this.httpClient.delete(`${this.baseUrl}/todos/${key}.json`).pipe(
    tap(() => {
      const itemIndex = this.items.map((item) => item.key).indexOf(key);
      this.items.splice(itemIndex, 1);
      this.itemsUpdated$.next(this.items);
    })
  )
  }

  updateTask(item:Item) {
   return this.httpClient.patch(`${this.baseUrl}/todos/${item.key}.json`,{
    description: item.description,
    done:item.done,
   }).pipe(
    tap(
      () => {
        const itemIndex = this.items.map((item)=>item.key).indexOf(item.key);
        this.items[itemIndex] = item;
        this.itemsUpdated$.next(this.items)
      }
    )
   )
  }
}
