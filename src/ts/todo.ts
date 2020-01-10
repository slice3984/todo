// @ts-ignore
import svgPath from '/img/sprite.svg';
import { TodoEdit } from './todo-edit';

export type todoData = {
    title: string;
    startDate: Date;
    endDate: Date;
    task: string;
    finished: boolean;
}

function formatDate(date: Date) {
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

export class Todo {
    private rootEl: HTMLDivElement;
    title: string;
    startDate: Date;
    endDate: Date;
    task: string;
    finished: boolean;
    expired: boolean;
    private isEdited: boolean = false;

    // DOM refs
    private todoEl: HTMLDivElement;
    private titleEl: HTMLHeadingElement;
    private dateEl: HTMLDivElement;
    private finishedEl: SVGSVGElement;
    private editEl: SVGSVGElement;
    private removeEl: SVGSVGElement;
    private contentEl: HTMLDivElement;

    private removeCb: (todo: Todo) => void;
    private saveCb: () => void;

    constructor(rootEl: string, data: todoData,
                removeCb: (todo: Todo) => void,
                saveCb: () => void) {
        this.rootEl = document.querySelector('.' + rootEl) as HTMLDivElement;
        this.removeCb = removeCb;
        this.saveCb = saveCb;
        this.title = data.title;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.task = data.task;
        this.finished = data.finished;
        this.render();
    }

    render() {
        const dateStr = this.getDateString();
        this.todoEl = document.createElement('div');
        this.todoEl.className = 'todo';

        // Todo header
        const todoHeader = document.createElement('div');
        todoHeader.className = 'todo__header';

        this.titleEl = document.createElement('h3');
        this.titleEl.textContent = this.title;
        todoHeader.appendChild(this.titleEl);

        this.dateEl = document.createElement('div');
        this.dateEl.className = 'todo__date';
        todoHeader.appendChild(this.dateEl);

        const todoControls = document.createElement('div');
        todoControls.className = 'todo__controls';

        this.finishedEl = this.getSVGIcon('done');
        todoControls.appendChild(this.finishedEl);

        this.editEl = this.getSVGIcon('edit');
        todoControls.appendChild(this.editEl);

        this.removeEl = this.getSVGIcon('delete');
        todoControls.appendChild(this.removeEl);

        todoHeader.appendChild(todoControls);

        // Todo content
        this.contentEl = document.createElement('div');
        this.contentEl.className = 'todo__content';
        this.contentEl.textContent = this.task;

        // Append to root todo div
        this.todoEl.appendChild(todoHeader);
        this.todoEl.appendChild(this.contentEl);

        if (this.finished) {
            this.toggleFinished();
        }

        if (this.getDaysLeft() < 0) {
            this.expired = true;
            this.toggleFailed();
            this.dateEl.textContent = formatDate(this.startDate) + ' - ' + formatDate(this.endDate) + ' - EXPIRED';
        } else {
            this.dateEl.textContent = dateStr;
        }

        this.rootEl.appendChild(this.todoEl);
        this.rootEl.scrollTop = this.rootEl.scrollHeight;

        // Attach handlers
        this.finishedEl.addEventListener('click', this.handleFinished.bind(this));
        this.editEl.addEventListener('click', this.handleEdit.bind(this));
        this.removeEl.addEventListener('click', this.handleRemove.bind(this));

    }

    private updateValues(data: todoData) {
        this.title = data.title;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.task = data.task;
        this.updateDom();
        this.saveCb();
    }

    private updateDom() {
        this.titleEl.textContent = this.title;
        if (this.getDaysLeft() > 0 && !this.finished) {
            this.dateEl.textContent = this.getDateString();
        } else if (this.finished) {
            this.dateEl.textContent = formatDate(this.startDate) + ' - ' + formatDate(this.endDate) + ' - FINISHED';
        } else {
            this.dateEl.textContent = formatDate(this.startDate) + ' - ' + formatDate(this.endDate) + ' - EXPIRED';
        }
        this.contentEl.textContent = this.task;
    }

    private getDaysLeft() {
        return Math.round((this.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    }

    private getDateString() {
        const daysLeft = this.getDaysLeft();
        const dateStr = formatDate(this.startDate) + ' - ' + formatDate(this.endDate) + ' ' +
            daysLeft + (daysLeft > 1 ? ' days' : ' day') + ' left';
        return dateStr;
    }

    private getSVGIcon(svg: string) {
        const elem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        elem.setAttribute('class', `todo__icon todo__icon-${svg}`);
        elem.innerHTML = `
            <use xlink:href="${svgPath}#icon-${svg}"></use>
        `;
        return elem;
    }

    private toggleFinished() {
        this.finishedEl.classList.toggle('selected-finished');
        this.todoEl.querySelector('.todo__content').classList.toggle('todo-finished');
    }

    private toggleFailed() {
        this.todoEl.querySelector('.todo__content').classList.toggle('todo-failed');
    }

    // Event handlers
    private handleFinished() {
        this.toggleFinished();
        this.finished = !this.finished;

        if (this.expired) {
            this.toggleFailed();
        }
        this.saveCb();
        this.updateDom();
    }

    private handleEdit(todo?: todoData) {    
        const editModalEl = document.getElementById('edit-modal') as HTMLDivElement;

        if (todo && !(todo instanceof Event)) {
            // Valid input, modify todo
            editModalEl.style.display = 'none';
            return;
        }

        TodoEdit.edit({
            title: this.title,
            startDate: this.startDate,
            endDate: this.endDate,
            task: this.task,
            finished: this.finished
        }, this.updateValues.bind(this));
    }

    private handleRemove() {
        this.todoEl.remove();
        this.removeCb(this);
    }
}