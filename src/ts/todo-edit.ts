import { todoData, Todo } from "./todo";
import { Validator } from "./validator";

export class TodoEdit {
    private static MAX_TITLE_LENGTH = 30;
    private static modalEl: HTMLDivElement = document.getElementById('edit-modal') as HTMLDivElement;
    private static formEl = TodoEdit.modalEl.querySelector('form');

    // Form el refs
    private static titleInputEl = document.getElementById('edit-title') as HTMLInputElement;
    private static dateStartInputEl = document.getElementById('edit-start-date') as HTMLInputElement;
    private static dateEndInputEl = document.getElementById('edit-end-date') as HTMLInputElement;
    private static todoInputEl = document.getElementById('edit-todo') as HTMLTextAreaElement;


    private constructor() {}


    static edit(data: todoData, updateValuesCb: (data: todoData) => void) {
        this.display(data);

        this.modalEl.querySelector('button').onclick = () => {
            this.modalEl.style.display = 'none';
        };

        this.formEl.onsubmit = e => {
            e.preventDefault();
            const title = this.titleInputEl.value;
            const startDate = this.dateStartInputEl.value;
            const endDate = this.dateEndInputEl.value;
            const todoInput = this.todoInputEl.value;

            const errorObj: { gotError: boolean, errorStr: string, faultyEls: HTMLElement[] } = {
                gotError: false,
                errorStr: 'Invalid values for:',
                faultyEls: []
            };

            if (!Validator.validate({ input: title, min: 1, max: this.MAX_TITLE_LENGTH })) {
                errorObj.gotError = true;
                errorObj.faultyEls.push(this.titleInputEl);
            }
    
            if (!Validator.validate({ input: startDate, isDate: true, inFuture: true }) &&
                !Validator.validate({ input: startDate, isDate: true, today: true })) {
                errorObj.gotError = true;
                errorObj.faultyEls.push(this.dateStartInputEl);
            }
    
            if (!Validator.validate({ input: endDate, isDate: true, inFuture: true })) {
                errorObj.gotError = true;

                errorObj.faultyEls.push(this.dateEndInputEl);
            }
    
            if (!Validator.validate({ input: todoInput, min: 1})) {
                errorObj.gotError = true;
                errorObj.faultyEls.push(this.todoInputEl);
            }
    
            if (errorObj.gotError) {
                for (const faultyEl of errorObj.faultyEls) {
                    faultyEl.classList.add('form-invalid-field');
                }
                setTimeout(() => {
                    for (const faultyEl of errorObj.faultyEls) {
                        faultyEl.classList.remove('form-invalid-field');
                    }
                }, 5000);
                return;
            }

            updateValuesCb({
                title,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                task: todoInput,
                finished: data.finished
            });

            this.modalEl.style.display = 'none';
        };
  
    }

    private static display(data: todoData) {
        this.modalEl.querySelector('h3').textContent = `Edit: ${data.title}`;
        this.titleInputEl.value = data.title; 
        this.dateStartInputEl.value = this.getDateStr(data.startDate);
        this.dateEndInputEl.value = this.getDateStr(data.endDate);
        this.todoInputEl.value = data.task;

        this.modalEl.style.display = 'block';
    }

    private static getDateStr(date: Date) {
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
}