import classie from 'classie';
import create from 'dom-create-element';

import Component from './utils/component';
import transitionEnd from './utils/after-transition';

class Scrollbar extends Component {
    constructor(el, opts = {}) {
        super(el, opts);
    }

    init() {
        super.init();

        this.$els.drag = create({ selector: 'div', styles: 'scrollbar' });

        this.resize();
        this.addScrollBar();
    }

    get getInitialState() {
        return {
            height: 0,
            width: 0,
            delta: 0,
            clicked: false,
            x: 0
        };
    }

    resize() {
        const prop = this.options.orientation === 'vertical' ? 'height' : 'width';
        this.dragHeight = Math.round(this.getState('height') * (this.getState('height') / (this.getState('bounding') + this.getState('height'))));
        this.$els.drag.style[prop] = `${this.dragHeight}px`;
    }

    addScrollBar() {
        const p1 = new Promise((resolve) => {
            this.$el.appendChild(this.$els.drag);
            this.options.listener.appendChild(this.$el);
            resolve();
        });

        p1.then(() => {
            classie.remove(this.$el, 'is-entering');
        });
    }

    removeScrollBar() {
        classie.add(this.$el, 'is-leaving');

        transitionEnd(this.$el, () => {
            this.options.listener.removeChild(this.$el);
        });
    }

    getTransform(value) {
        return this.options.orientation === 'vertical' ? `translate3d(0, ${value}px, 0)` : `translate3d(${value}px,0,0)`;
    }

    update(current) {
        const size = this.dragHeight;
        const bounds = this.options.orientation === 'vertical' ? this.getState('height') : this.options.width;
        const value = (Math.abs(current) / (this.getState('bounding') / (bounds - size))) + (size / 0.5) - size;
        const clamp = Math.round(Math.max(0, Math.min(value - size, value + size)));

        this.$els.drag.style[this.options.prefix] = this.getTransform(clamp);
    }


    destroy() {
        super.destroy();
        this.removeScrollBar();
    }
}

export default Scrollbar;
