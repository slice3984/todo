// @ts-ignore
import svg from '/img/sprite.svg';

export class DomUtils {
    private static headerEl: HTMLDivElement = document.querySelector('.header') as HTMLDivElement;
    private constructor() { }

    static showWarning(msg: string, time: number) {
        const popupEl = document.createElement('div');
        popupEl.classList.add('popup');
        popupEl.innerHTML = `
        <svg>
            <use xlink:href="${svg}#icon-notification"></use>
        </svg>
        <h2>${msg}</h2>
        `;
        DomUtils.headerEl.insertAdjacentElement('afterend', popupEl);

        setTimeout(() => {
            const fadeOut = setInterval(() => {
                if (!popupEl.style.opacity) {
                    popupEl.style.opacity = '1';
                }
                popupEl.style.opacity = (+popupEl.style.opacity - 0.05).toString();
                if (popupEl.style.opacity === '0') {
                    popupEl.remove();
                    clearInterval(fadeOut);
                }
            }, 50);
        }, time);
    }
}