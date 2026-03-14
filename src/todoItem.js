export default class Todo{
    constructor(title, description, priority, dueDate){
        this.id = String(crypto.randomUUID());
        this.title = title;
        this.description = description;
        if(priority !== "low" && priority !== "mid" && priority !== "high"){
            throw new Error("No such priority type!");
        }
        this._priority = priority;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = false;
    }


    toString(){
        return `Instance of class Todo, title: ${this.title}, desc: ${this.description}, priority: ${this.priority}, dueDate: ${this.dueDate}`;        
    }
}