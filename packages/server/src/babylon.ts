import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from '@babylonjs/core';

export class Widget {
    private camera: ArcRotateCamera;
    private scene: Scene;
    private frame = 0;

    constructor(canvas: HTMLCanvasElement) {
        const engine = new Engine(canvas, true);
        this.scene = new Scene(engine);

        this.camera = new ArcRotateCamera('Camera', 0, Math.PI / 2, 2, Vector3.Zero(), this.scene);
        this.camera.attachControl(canvas, true);

        new HemisphericLight('light1', new Vector3(1, 1, 0), this.scene);

        MeshBuilder.CreateSphere('sphere', { diameter: 1 }, this.scene);
    }

    public async moveCamera(): Promise<number> {
        await this.waitForFrame();

        this.camera.alpha += 2 * Math.PI / 60;
        this.scene.render();

        await this.waitForFrame();

        this.frame += 1;

        return this.frame;
    }

    async waitForFrame(): Promise<void> {
        return new Promise(res => requestAnimationFrame(() => res()));
    }
}

(function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>window).Widget = Widget;
})();
