export default class Project{
    todos = []
    constructor(name){
        this.id = crypto.randomUUID();
        this.name = name;
    }

    addTodo(todo){
        this.todos.unshift(todo);
    }

    removeTodo(todoUUID){
        this.todos = this.todos.filter((todo, index, arr) => todo.id !== todoUUID);
    }

    toString(){
        let returnString = "";
        for (const todo of this.todos) {
            returnString += todo.toString() + "\n"
        }
        return returnString;
    };
}