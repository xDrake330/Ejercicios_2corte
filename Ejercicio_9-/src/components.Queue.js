export class Queue {
  constructor(items = []){
    this.items = Array.from(items);
  }
  enqueue(item){
    this.items.push(item);
  }
  dequeue(){
    return this.items.shift();
  }
  peek(){
    return this.items[0];
  }
  size(){
    return this.items.length;
  }
  clear(){
    this.items = [];
  }
  toArray(){
    return [...this.items];
  }
}
