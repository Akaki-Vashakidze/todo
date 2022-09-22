import { Injectable } from "@angular/core"
import { Item } from "./item.model"

@Injectable({providedIn:'root'})
export class ItemsService {
  items : Item[] = [
    {description:'davrekot dgf',done:false},
    {description:'gavarvizot', done:true},
    {description:'vchamo', done:false}
  ]

  setItems(){
    localStorage.setItem('todos',JSON.stringify(this.items))
  }

  getItems(){
   let savedItems = localStorage.getItem('todos');
   if (savedItems) {
    this.items = JSON.parse(savedItems);
   }
   return this.items;
  }

  addItems(newItemDesc:string) {
    this.items.unshift({description:newItemDesc,done:false})
    this.setItems()
  }

  deleteItem(index:number) {
   this.items.splice(index,1)
   this.setItems()
  }

  finishedTask(index2:number) {
    this.items[index2].done = !this.items[index2].done ;
    this.setItems();
  }

}