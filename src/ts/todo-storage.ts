import { Todo, todoData } from "./todo";

export class TodoStorage {
    private static PREFIX = 'TODO_';

    private constructor() {}

    static getTodos() {
        const todos = localStorage.getItem(this.PREFIX + 'items');
        let parsedTodos = [];

        if (todos) {
            parsedTodos = JSON.parse(todos);
        }
        return parsedTodos
    }
    
    static getUnparsedTodos() {
        return localStorage.getItem(this.PREFIX + 'items') || '';
    }

    static saveTodos(todos: Todo[]) {
        const todoData: todoData[] = [];
        
        for (const todo of todos) {
            todoData.push({
                title: todo.title,
                startDate: todo.startDate,
                endDate: todo.endDate,
                task: todo.task,
                finished: todo.finished
            });
        }

        localStorage.setItem(this.PREFIX + 'items', JSON.stringify(todoData));
    }

    static saveJson(json: string) {
        localStorage.setItem(this.PREFIX + 'items', json);
    }

    static clearLS() {
        localStorage.removeItem(this.PREFIX + 'items');
    }
}