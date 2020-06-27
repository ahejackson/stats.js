/**
 * @author mrdoob / http://mrdoob.com/
 */
export default class Stats {
    constructor() {
        this.#mode = 0;
        this.frames = 0;
        this.dom = document.createElement('div');
        this.dom.style.cssText =
            'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
        this.dom.addEventListener('click', (event) => {
            event.preventDefault();
            this.showPanel(++this.#mode % this.dom.children.length);
        }, false);
        this.beginTime = (performance || Date).now();
        this.prevTime = this.beginTime;
        this.frames = 0;
        this.fpsPanel = this.addPanel(new StatsPanel('FPS', '#0ff', '#002'));
        this.msPanel = this.addPanel(new StatsPanel('MS', '#0f0', '#020'));
        // @ts-ignore
        if (self.performance && self.performance.memory) {
            this.memPanel = this.addPanel(new StatsPanel('MB', '#f08', '#201'));
        }
        this.showPanel(0);
    }
    #mode;
    addPanel(panel) {
        this.dom.appendChild(panel.dom);
        return panel;
    }
    showPanel(id) {
        for (let i = 0; i < this.dom.children.length; i++) {
            // @ts-ignore
            this.dom.children[i].style.display = i === id ? 'block' : 'none';
        }
        this.#mode = id;
    }
    begin() {
        this.beginTime = (performance || Date).now();
    }
    end() {
        this.frames++;
        let time = (performance || Date).now();
        this.msPanel.update(time - this.beginTime, 200);
        if (time >= this.prevTime + 1000) {
            this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
            this.prevTime = time;
            this.frames = 0;
            if (this.memPanel) {
                // @ts-ignore
                var memory = performance.memory;
                this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
            }
        }
        return time;
    }
    update() {
        this.beginTime = this.end();
    }
}
export class StatsPanel {
    constructor(name, foregroundColor, backgroundColor) {
        this.name = name;
        this.foregroundColor = foregroundColor;
        this.backgroundColor = backgroundColor;
        this.min = Infinity;
        this.max = 0;
        this.pixelRatio = Math.round(window.devicePixelRatio || 1);
        this.#width = 80 * this.pixelRatio;
        this.#height = 48 * this.pixelRatio;
        this.#textX = 3 * this.pixelRatio;
        this.#textY = 2 * this.pixelRatio;
        this.#graphX = 3 * this.pixelRatio;
        this.#graphY = 15 * this.pixelRatio;
        this.#graphWidth = 74 * this.pixelRatio;
        this.#graphHeight = 30 * this.pixelRatio;
        this.dom = document.createElement('canvas');
        this.dom.width = this.#width;
        this.dom.height = this.#height;
        this.dom.style.cssText = 'width:80px;height:48px';
        this.context = this.dom.getContext('2d');
        this.context.font = `bold ${9 * this.pixelRatio}px Helvetica,Arial,sans-serif`;
        this.context.textBaseline = 'top';
        this.context.fillStyle = backgroundColor;
        this.context.fillRect(0, 0, this.#width, this.#height);
        this.context.fillStyle = this.foregroundColor;
        this.context.fillText(name, this.#textX, this.#textY);
        this.context.fillRect(this.#graphX, this.#graphY, this.#graphWidth, this.#graphHeight);
        this.context.fillStyle = backgroundColor;
        this.context.globalAlpha = 0.9;
        this.context.fillRect(this.#graphX, this.#graphY, this.#graphWidth, this.#graphHeight);
    }
    // dimensions
    #width;
    #height;
    #textX;
    #textY;
    #graphX;
    #graphY;
    #graphWidth;
    #graphHeight;
    update(value, maxValue) {
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        this.context.fillStyle = this.backgroundColor;
        this.context.globalAlpha = 1;
        this.context.fillRect(0, 0, this.#width, this.#graphY);
        this.context.fillStyle = this.foregroundColor;
        this.context.fillText(`${Math.round(value)} ${name} (${Math.round(this.min)}-${Math.round(this.max)})`, this.#textX, this.#textY);
        this.context.drawImage(this.dom, this.#graphX + this.pixelRatio, this.#graphY, this.#graphWidth - this.pixelRatio, this.#graphHeight, this.#graphX, this.#graphY, this.#graphWidth - this.pixelRatio, this.#graphHeight);
        this.context.fillRect(this.#graphX + this.#graphWidth - this.pixelRatio, this.#graphY, this.pixelRatio, this.#graphHeight);
        this.context.fillStyle = this.backgroundColor;
        this.context.globalAlpha = 0.9;
        this.context.fillRect(this.#graphX + this.#graphWidth - this.pixelRatio, this.#graphY, this.pixelRatio, Math.round((1 - value / maxValue) * this.#graphHeight));
    }
}
