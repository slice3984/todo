import { Validator } from './validator';
import { DomUtils } from './dom-utils';
import { TodoState } from './todo-state';
import { Todo } from './todo';

const MAX_TITLE_LENGTH = 30;

export class TodoCreationInput {
    formEl: HTMLFormElement;
    titleInputEl: HTMLInputElement;
    startDateInputEl: HTMLInputElement;
    endDateInputEl: HTMLInputElement;
    todoInputEl: HTMLTextAreaElement;

    constructor(formEl: string) {
        this.formEl = document.getElementById(formEl) as HTMLFormElement;
        this.titleInputEl = document.getElementById('title') as HTMLInputElement;
        this.startDateInputEl = document.getElementById('date-start') as HTMLInputElement;
        this.endDateInputEl = document.getElementById('date-end') as HTMLInputElement;
        this.todoInputEl = document.getElementById('task') as HTMLTextAreaElement;

        this.configure();
    }

    private configure() {
        this.formEl.addEventListener('submit', this.submitHandler.bind(this));
    }

    private submitHandler(e: Event) {
        e.preventDefault();

        const errorObj: { gotError: boolean, errorStr: string, faultyEls: HTMLElement[] } = {
            gotError: false,
            errorStr: 'Invalid values for:',
            faultyEls: []
        };

        const title = this.titleInputEl.value;
        const startDate = this.startDateInputEl.value;
        const endDate = this.endDateInputEl.value;
        const todoInput = this.todoInputEl.value;

        if (!Validator.validate({ input: title, min: 1, max: MAX_TITLE_LENGTH })) {
            errorObj.gotError = true;
            errorObj.errorStr += ' title,';
            errorObj.faultyEls.push(this.titleInputEl);
        }

        if (!Validator.validate({ input: startDate, isDate: true, inFuture: true }) &&
            !Validator.validate({ input: startDate, isDate: true, today: true })) {
            errorObj.gotError = true;
            errorObj.errorStr += ' start,';
            errorObj.faultyEls.push(this.startDateInputEl);
        }

        if (!Validator.validate({ input: endDate, isDate: true, inFuture: true })) {
            errorObj.gotError = true;
            errorObj.errorStr += ' end,';
            errorObj.faultyEls.push(this.endDateInputEl);
        }

        if (!Validator.validate({ input: todoInput, min: 1})) {
            errorObj.gotError = true;
            errorObj.errorStr += ' task,';
            errorObj.faultyEls.push(this.todoInputEl);
        }

        if (errorObj.gotError) {
            DomUtils.showWarning(errorObj.errorStr.substring(0, errorObj.errorStr.length - 1), 5000);
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
        TodoState.getInstance().addTodo({
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            task: todoInput,
            finished: false
        });
    }
}