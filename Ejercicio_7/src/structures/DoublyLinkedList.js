// Lista doblemente enlazada
class DNode{
  constructor(value){ this.value=value; this.prev=null; this.next=null }
}

export default class DoublyLinkedList{
  constructor(){ this.head=null; this.tail=null; this.length=0; this.cursor=null }
  push(value){
    const n = new DNode(value)
    if(!this.head){ this.head=n; this.tail=n }
    else { n.prev=this.tail; this.tail.next=n; this.tail=n }
    this.length++; if(!this.cursor) this.cursor=this.head
    return this
  }
  current(){ return this.cursor ? this.cursor.value : null }
  next(){ if(this.cursor && this.cursor.next){ this.cursor=this.cursor.next; return this.cursor.value } return null }
  prev(){ if(this.cursor && this.cursor.prev){ this.cursor=this.cursor.prev; return this.cursor.value } return null }
  hasNext(){ return !!(this.cursor && this.cursor.next) }
  hasPrev(){ return !!(this.cursor && this.cursor.prev) }
  resetToHead(){ this.cursor=this.head; return this.current() }
  resetToTail(){ this.cursor=this.tail; return this.current() }
  toArray(){ const a=[]; let p=this.head; while(p){ a.push(p.value); p=p.next } return a }
}
