/**
 * @author mrdoob / http://mrdoob.com/
 */
export default class Stats {
    #private;
    static REVISION: 17;
    dom: HTMLDivElement;
    beginTime: number;
    prevTime: number;
    frames: number;
    fpsPanel: StatsPanel;
    msPanel: StatsPanel;
    memPanel?: StatsPanel;
    constructor();
    addPanel(panel: StatsPanel): StatsPanel;
    showPanel(id: number): void;
    begin(): void;
    end(): number;
    update(): void;
}
export declare class StatsPanel {
    #private;
    name: string;
    foregroundColor: string;
    backgroundColor: string;
    min: number;
    max: number;
    pixelRatio: number;
    dom: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    constructor(name: string, foregroundColor: string, backgroundColor: string);
    update(value: number, maxValue: number): void;
}
//# sourceMappingURL=Stats.d.ts.map