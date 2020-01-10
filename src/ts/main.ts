import { Validator } from './validator';
import { DomUtils } from './dom-utils';
import { TodoCreationInput } from './todo-creation-input';
import { TodoState } from './todo-state';
import { Todo } from './todo';
import { TodoStorage } from './todo-storage';

const startDateEl = document.getElementById('date-start') as HTMLInputElement; 

// Update start date to todays date
const date = new Date();
const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
const year = date.getFullYear();
const dateStr = `${year}-${month}-${day}`;

document.getElementById('add-todo-form').addEventListener('reset', e => {
    e.preventDefault();
    (document.getElementById('title') as HTMLInputElement).value = '';
    (document.getElementById('date-end') as HTMLInputElement).value = '';
    (document.getElementById('task') as HTMLTextAreaElement).value = '';
    startDateEl.value = dateStr;
});

startDateEl.value = dateStr;

new TodoCreationInput('add-todo-form');
TodoState.getInstance();