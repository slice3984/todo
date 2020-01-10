import { Todo, todoData } from './todo';
import { TodoStorage } from './todo-storage';
import { Settings } from './settings';

export class TodoState {
    private static instance: TodoState;
    private todos: Todo[] = [];
    private sortByDueDateEl = document.getElementById('sort-by-due');
    private hideFinishedEl = document.getElementById('hide-finished');
    private exportButtonEl = document.getElementById('export-todos');
    private importButtonEl = document.getElementById('import-todos') as HTMLInputElement;
    private deleteButtonEl = document.getElementById('delete-todos');
    private settingsButtonEl = document.getElementById('open-settings');
    private settingsEl = document.getElementById('settings-modal');

    private hidingFinished = false;

    private constructor() {
        this.sortByDueDateEl.addEventListener('click', this.sortByDueDate.bind(this));
        this.hideFinishedEl.addEventListener('click', this.hideFinished.bind(this));
        this.exportButtonEl.addEventListener('click', Settings.exportTodos);
        this.importButtonEl.addEventListener('change', Settings.importTodos);
        this.deleteButtonEl.addEventListener('click', Settings.deleteTodos);
        this.settingsButtonEl.addEventListener('click', () => this.settingsEl.classList.toggle('hide-settings'))

        // Load todos from LS
        const todoData: todoData[] = TodoStorage.getTodos();
        
        if (todoData.length > 0) {
            for (const dataObj of todoData) {
                this.addTodo({
                    title: dataObj.title,
                    startDate: new Date(dataObj.startDate),
                    endDate: new Date(dataObj.endDate),
                    task: dataObj.task,
                    finished: dataObj.finished
                });
            }
        }
        this.rerender(this.todos);
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new TodoState();
        }

        return this.instance;
    }

    addTodo(data: todoData) {
        const todo = new Todo('todos__content', data,
                    this.removeTodo.bind(this),
                    this.saveTodos.bind(this));
        this.todos.push(todo);
        TodoStorage.saveTodos(this.todos);
    }

    removeTodo(todo: Todo) {
        const index = this.todos.findIndex(t => t === todo);
        this.todos.splice(index, 1);
        TodoStorage.saveTodos(this.todos);
    }

    rerender(list: Todo[]) {
        document.querySelector('.todos__content').innerHTML = '';
        for (const todo of list) {
            todo.render();
        }
    }

    sortByDueDate() {
        const sortFunc = (a, b) => {
            return (a.endDate.getTime() - a.startDate.getTime()) -
                    (b.endDate.getTime() - b.startDate.getTime())
        };

        if (this.hidingFinished) {
            const filteredTodos = this.todos.filter(todo => !todo.expired && !todo.finished);
            filteredTodos.sort(sortFunc);
            this.rerender(filteredTodos);
        } else {
            this.todos.sort(sortFunc);
            this.rerender(this.todos);
        }
        
    }

    hideFinished() {
        if (this.hidingFinished) {
            this.rerender(this.todos);
            this.hidingFinished = false;
            this.hideFinishedEl.classList.toggle('control-enabled');
            return;
        }
        this.hideFinishedEl.classList.toggle('control-enabled');
        const filteredTodos = this.todos.filter(todo => !todo.expired && !todo.finished);
        this.rerender(filteredTodos);
        this.hidingFinished = true;
        console.log(filteredTodos);
    }

    saveTodos() {
        TodoStorage.saveTodos(this.todos);
    }
} 