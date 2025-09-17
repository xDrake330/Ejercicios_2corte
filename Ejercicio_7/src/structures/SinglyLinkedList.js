// Lista enlazada simple
class Node{
  constructor(value){ this.value = value; this.next = null }
}

export default class SinglyLinkedList{
  constructor(){ this.head = null; this.tail = null; this.length = 0; this.cursor = null }
  push(value){
    const n = new Node(value)
    if(!this.head){ this.head=n; this.tail=n }
    else { this.tail.next = n; this.tail = n }
    this.length++; if(!this.cursor) this.cursor = this.head
    return this
  }
  reset(){ this.cursor = this.head; return this.current() }
  current(){ return this.cursor ? this.cursor.value : null }
  next(){
    if(this.cursor && this.cursor.next){ this.cursor = this.cursor.next; return this.cursor.value }
    return null
  }
  hasNext(){ return !!(this.cursor && this.cursor.next) }
  isEmpty(){ return this.length===0 }
  toArray(){ const a=[]; let p=this.head; while(p){ a.push(p.value); p=p.next } return a }
}
