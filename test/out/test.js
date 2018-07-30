/// <reference path="../../dist/alviss.d.ts"/>
class Main {
    static Run() {
        let canvas = document.getElementById("render-canvas-snake");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 128;
            canvas.height = 128;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let g = new Alviss.GameObject(scene);
            g.transform.position.x = 25;
            g.transform.position.y = 30;
            new Snake(g);
        }
    }
}
class Snake extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this.direction = new Alviss.Vector2(1, 0);
        this.parts = new Alviss.List();
        this.t = 0;
        this.speed = 2;
    }
    start() {
        this.gameObject.AddComponent(Alviss.SpriteRenderer);
        this.gameObject.spriteRenderer.sprite = Alviss.SpriteTools.CreateSprite(`
                00111100
                01222210
                12333321
                12844821
                12344321
                12333321
                01222210
                00111100
            `, 256, 256, 0, 256);
        this.gameObject.transform.position.x = 8 * 4;
        this.gameObject.transform.position.y = 8 * 4;
    }
    update() {
        super.update();
        if (this.engine.input.getPadButton(Alviss.PadButton.Up)) {
            this.direction.x = 0;
            this.direction.y = 1;
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Down)) {
            this.direction.x = 0;
            this.direction.y = -1;
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Right)) {
            this.direction.x = 1;
            this.direction.y = 0;
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Left)) {
            this.direction.x = -1;
            this.direction.y = 0;
        }
        this.t++;
        if (this.t > 60 / this.speed) {
            this.t = 0;
            let lastX = this.gameObject.transform.position.x;
            let lastY = this.gameObject.transform.position.y;
            this.gameObject.transform.position.x += this.direction.x * 8;
            this.gameObject.transform.position.y += this.direction.y * 8;
            if (Math.random() > 0.9) {
                let newPart = new Alviss.GameObject(this.scene);
                newPart.AddComponent(Alviss.SpriteRenderer);
                newPart.spriteRenderer.sprite = Alviss.SpriteTools.CreateSprite(`
                        00111100
                        01222210
                        12333321
                        12344321
                        12344321
                        12333321
                        01222210
                        00111100
                    `, 256, 256, 0, 256);
                newPart.transform.position.x = lastX;
                newPart.transform.position.y = lastY;
                this.parts.push_first(newPart);
                this.speed *= 1.05;
            }
            else {
                for (let i = this.parts.length - 1; i > 0; i--) {
                    let part = this.parts.get(i);
                    let previousPart = this.parts.get(i - 1);
                    part.transform.position.x = previousPart.transform.position.x;
                    part.transform.position.y = previousPart.transform.position.y;
                }
                let part0 = this.parts.get(0);
                if (part0) {
                    part0.transform.position.x = lastX;
                    part0.transform.position.y = lastY;
                }
            }
        }
    }
}
class TestMBH1 extends Alviss.MonoBehaviour {
    update() {
        super.update();
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Up)) {
            this.gameObject.transform.position.y += 1;
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Down)) {
            this.gameObject.transform.position.y -= 1;
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.gameObject.transform.position.x += 1;
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.gameObject.transform.position.x -= 1;
        }
    }
}
