var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _mode, _width, _height, _textX, _textY, _graphX, _graphY, _graphWidth, _graphHeight;
/**
 * @author mrdoob / http://mrdoob.com/
 */
export default class Stats {
    constructor() {
        _mode.set(this, 0);
        this.frames = 0;
        this.dom = document.createElement('div');
        this.dom.style.cssText =
            'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
        this.dom.addEventListener('click', (event) => {
            event.preventDefault();
            this.showPanel(__classPrivateFieldSet(this, _mode, +__classPrivateFieldGet(this, _mode) + 1) % this.dom.children.length);
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
    addPanel(panel) {
        this.dom.appendChild(panel.dom);
        return panel;
    }
    showPanel(id) {
        for (let i = 0; i < this.dom.children.length; i++) {
            // @ts-ignore
            this.dom.children[i].style.display = i === id ? 'block' : 'none';
        }
        __classPrivateFieldSet(this, _mode, id);
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
_mode = new WeakMap();
export class StatsPanel {
    constructor(name, foregroundColor, backgroundColor) {
        this.name = name;
        this.foregroundColor = foregroundColor;
        this.backgroundColor = backgroundColor;
        this.min = Infinity;
        this.max = 0;
        // dimensions
        _width.set(this, void 0);
        _height.set(this, void 0);
        _textX.set(this, void 0);
        _textY.set(this, void 0);
        _graphX.set(this, void 0);
        _graphY.set(this, void 0);
        _graphWidth.set(this, void 0);
        _graphHeight.set(this, void 0);
        this.pixelRatio = Math.round(window.devicePixelRatio || 1);
        __classPrivateFieldSet(this, _width, 80 * this.pixelRatio);
        __classPrivateFieldSet(this, _height, 48 * this.pixelRatio);
        __classPrivateFieldSet(this, _textX, 3 * this.pixelRatio);
        __classPrivateFieldSet(this, _textY, 2 * this.pixelRatio);
        __classPrivateFieldSet(this, _graphX, 3 * this.pixelRatio);
        __classPrivateFieldSet(this, _graphY, 15 * this.pixelRatio);
        __classPrivateFieldSet(this, _graphWidth, 74 * this.pixelRatio);
        __classPrivateFieldSet(this, _graphHeight, 30 * this.pixelRatio);
        this.dom = document.createElement('canvas');
        this.dom.width = __classPrivateFieldGet(this, _width);
        this.dom.height = __classPrivateFieldGet(this, _height);
        this.dom.style.cssText = 'width:80px;height:48px';
        this.context = this.dom.getContext('2d');
        this.context.font = `bold ${9 * this.pixelRatio}px Helvetica,Arial,sans-serif`;
        this.context.textBaseline = 'top';
        this.context.fillStyle = backgroundColor;
        this.context.fillRect(0, 0, __classPrivateFieldGet(this, _width), __classPrivateFieldGet(this, _height));
        this.context.fillStyle = this.foregroundColor;
        this.context.fillText(name, __classPrivateFieldGet(this, _textX), __classPrivateFieldGet(this, _textY));
        this.context.fillRect(__classPrivateFieldGet(this, _graphX), __classPrivateFieldGet(this, _graphY), __classPrivateFieldGet(this, _graphWidth), __classPrivateFieldGet(this, _graphHeight));
        this.context.fillStyle = backgroundColor;
        this.context.globalAlpha = 0.9;
        this.context.fillRect(__classPrivateFieldGet(this, _graphX), __classPrivateFieldGet(this, _graphY), __classPrivateFieldGet(this, _graphWidth), __classPrivateFieldGet(this, _graphHeight));
    }
    update(value, maxValue) {
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        this.context.fillStyle = this.backgroundColor;
        this.context.globalAlpha = 1;
        this.context.fillRect(0, 0, __classPrivateFieldGet(this, _width), __classPrivateFieldGet(this, _graphY));
        this.context.fillStyle = this.foregroundColor;
        this.context.fillText(`${Math.round(value)} ${name} (${Math.round(this.min)}-${Math.round(this.max)})`, __classPrivateFieldGet(this, _textX), __classPrivateFieldGet(this, _textY));
        this.context.drawImage(this.dom, __classPrivateFieldGet(this, _graphX) + this.pixelRatio, __classPrivateFieldGet(this, _graphY), __classPrivateFieldGet(this, _graphWidth) - this.pixelRatio, __classPrivateFieldGet(this, _graphHeight), __classPrivateFieldGet(this, _graphX), __classPrivateFieldGet(this, _graphY), __classPrivateFieldGet(this, _graphWidth) - this.pixelRatio, __classPrivateFieldGet(this, _graphHeight));
        this.context.fillRect(__classPrivateFieldGet(this, _graphX) + __classPrivateFieldGet(this, _graphWidth) - this.pixelRatio, __classPrivateFieldGet(this, _graphY), this.pixelRatio, __classPrivateFieldGet(this, _graphHeight));
        this.context.fillStyle = this.backgroundColor;
        this.context.globalAlpha = 0.9;
        this.context.fillRect(__classPrivateFieldGet(this, _graphX) + __classPrivateFieldGet(this, _graphWidth) - this.pixelRatio, __classPrivateFieldGet(this, _graphY), this.pixelRatio, Math.round((1 - value / maxValue) * __classPrivateFieldGet(this, _graphHeight)));
    }
}
_width = new WeakMap(), _height = new WeakMap(), _textX = new WeakMap(), _textY = new WeakMap(), _graphX = new WeakMap(), _graphY = new WeakMap(), _graphWidth = new WeakMap(), _graphHeight = new WeakMap();
