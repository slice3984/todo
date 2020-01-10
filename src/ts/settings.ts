import { Todo } from "./todo";
import { TodoStorage } from "./todo-storage";

export class Settings {
    private static exportButtonEl = document.getElementById('export-todos');
    private static importButtonEl = document.getElementById('import-todos') as HTMLInputElement;

    private constructor() {}

    static exportTodos() {
         const todos = TodoStorage.getUnparsedTodos();
         if (todos.length > 0) {
             const data = new Blob([todos], {
                 type: 'text/plain'
             });
             Settings.exportButtonEl.setAttribute('href', URL.createObjectURL(data))
             Settings.exportButtonEl.setAttribute('download', 'todos.txt');
         }
    }

    static importTodos() {
        const file = Settings.importButtonEl.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = evt => {
                TodoStorage.saveJson((evt.target.result) as string);
            }
        }
        location.reload();
    }

    static deleteTodos() {
        TodoStorage.clearLS();
        location.reload();
    }
}