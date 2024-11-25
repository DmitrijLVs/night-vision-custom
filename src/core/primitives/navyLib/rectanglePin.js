export default class RectanglePin {

    constructor(core, line, corner, params = {}) {
        this.RADIUS = core.props.config.PIN_RADIUS;
        this.RADIUS_SQ = Math.pow(this.RADIUS + 7, 2);

        if (core.lib.Utils.isMobile) {
            this.RADIUS += 2;
            this.RADIUS_SQ *= 2.5;
        }

        this.COLOR_BACK = core.colors.back;
        this.COLOR_BR = core.colors.text;

        this.core = core;
        this.rectangle = line;
        this.corner = corner; // Corner of the rectangle (p1, p2, p3, p4)
        this.data = line.data;
        this.state = params.state || 'settled';
        this.hidden = params.hidden || false;
        this.mouse = this.core.mouse;

        this.init();
    }

    // Initialize from data
    init() {
        if (this.data && this.data[this.corner]) {
            let p = this.data[this.corner];
            this.t = p[0]; // Time coordinate
            this.y$ = p[1]; // Value coordinate
        }
    }

    draw(ctx) {
        if (this.hidden) return;
        switch (this.state) {
            case 'tracking':
                break;
            case 'dragging':
                if (!this.moved) this.drawCircle(ctx);
                break;
            case 'settled':
                this.drawCircle(ctx);
                break;
        }
    }

    drawCircle(ctx) {
        let r = this.rectangle.selected ? this.RADIUS : this.RADIUS * 0.95;
        let lw = this.rectangle.selected ? 1.5 : 1;

        ctx.lineWidth = lw;
        ctx.strokeStyle = this.COLOR_BR;
        ctx.fillStyle = this.COLOR_BACK;
        ctx.beginPath();
        ctx.arc(
            this.x = this.core.layout.time2x(this.t),
            this.y = this.core.layout.value2y(this.y$),
            r + 0.5, 0, Math.PI * 2, true
        );
        ctx.fill();
        ctx.stroke();
    }

    update() {
        // Update based on current mouse position
        let layout = this.core.layout;
        let y$ = layout.y2value(this.core.cursor.y);
        this.x = this.core.cursor.x;
        this.y = this.core.cursor.y;
        this.t = this.core.cursor.time;
        this.y$ = y$;

        // Save the updated position back to the data object
        this.data[this.corner] = [this.t, this.y$];
        

        // Update the corresponding opposite corner
        // this.rectangle.update(this.data.p1, this.data.p2);
    }

    mousemove(event) {
        if (this.state === 'dragging') {
            this.moved = true;
            this.update();
        }
    }

    mousedown(event) {
        const Utils = this.core.lib.Utils;
        if (Utils.defaultPrevented(event)) return;

        if (this.state === 'settled' && this.hover()) {
            this.state = 'dragging';
            this.moved = false;
            this.core.events.emit('scroll-lock', true);
        }
        if (this.hover()) {
            event.preventDefault();
        }
    }

    mouseup(event) {
        if (this.state === 'dragging') {
            this.state = 'settled';
            if (this.onSettled) this.onSettled();
            this.core.events.emit('scroll-lock', false);
        }
    }

    on(name, handler) {
        if (name === 'settled') {
            this.onSettled = handler;
        }
    }

    hover() {
        // Check if mouse is hovering over the pin
        let x = this.x;
        let y = this.y;
        return (
            (x - this.mouse.x) * (x - this.mouse.x) +
            (y - this.mouse.y) * (y - this.mouse.y)
        ) < this.RADIUS_SQ;
    }
}