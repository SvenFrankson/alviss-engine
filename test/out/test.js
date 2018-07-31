class CollisionTestMBH extends Alviss.MonoBehaviour {
    Update() {
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
    OnCollisionEnter(collision) {
        console.log("Collision Enter");
    }
    OnCollisionStay(collision) {
        console.log("Collision Stay");
    }
    OnCollisionExit(collision) {
        console.log("Collision Exit");
    }
}
class CollisionAutoTestMBH extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this.direction = Alviss.Vector2.Zero();
        this.radius = 8;
    }
    Start() {
        this.gameObject.AddComponent(Alviss.SpriteRenderer);
        this.gameObject.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(this.radius, 0, 64 * Math.random(), 256 * Math.random(), 256);
        this.GetComponent(Alviss.DiscCollider).radius = this.radius;
    }
    Update() {
        this.transform.position.addInPlace(this.direction.scale(0.75));
        if (this.transform.position.x - this.radius <= 0 && this.direction.x < 0) {
            this.direction.x *= -1;
        }
        if (this.transform.position.x + this.radius > this.engine.width && this.direction.x > 0) {
            this.direction.x *= -1;
        }
        if (this.transform.position.y - this.radius <= 0 && this.direction.y < 0) {
            this.direction.y *= -1;
        }
        if (this.transform.position.y + this.radius > this.engine.height && this.direction.y > 0) {
            this.direction.y *= -1;
        }
    }
    OnCollisionEnter(collision) {
        let n = this.transform.position.clone().subtractInPlace(collision.contact);
        this.direction.mirrorInPlace(n);
    }
    OnCollisionStay(collision) { }
    OnCollisionExit(collision) { }
}
/// <reference path="../../dist/alviss.d.ts"/>
class Main {
    static Run() {
        Main.RunSnake();
        Main.RunCollisionTest();
        Main.RunCollisionAutoTest();
        Main.RunPhysicTest();
    }
    static RunSnake() {
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
    static RunCollisionTest() {
        let canvas = document.getElementById("render-canvas-collision");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 128;
            canvas.height = 128;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let g = new Alviss.GameObject(scene);
            g.AddComponent(Alviss.SpriteRenderer);
            g.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(16, 0, 0, 256, 256);
            g.transform.position.x = 16;
            g.transform.position.y = 16;
            g.AddComponent(Alviss.DiscCollider);
            g.GetComponent(Alviss.DiscCollider).radius = 8;
            g.AddComponent(CollisionTestMBH);
            let o = new Alviss.GameObject(scene);
            o.AddComponent(Alviss.SpriteRenderer);
            o.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(16, 256, 0, 0, 256);
            o.transform.position.x = 64;
            o.transform.position.y = 64;
            o.AddComponent(Alviss.DiscCollider);
            o.GetComponent(Alviss.DiscCollider).radius = 8;
        }
    }
    static RunCollisionAutoTest() {
        let canvas = document.getElementById("render-canvas-collision-auto");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 512;
            canvas.height = 512;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            for (let i = 0; i < 500; i++) {
                let g = new Alviss.GameObject(scene);
                g.transform.position.x = Math.random() * engine.width;
                g.transform.position.y = Math.random() * engine.height;
                g.AddComponent(Alviss.DiscCollider);
                g.AddComponent(CollisionAutoTestMBH);
                g.GetComponent(CollisionAutoTestMBH).radius = Math.floor(Math.random() * 4 + 4);
                g.GetComponent(CollisionAutoTestMBH).direction.x = Math.random() - 0.5;
                g.GetComponent(CollisionAutoTestMBH).direction.y = Math.random() - 0.5;
                g.GetComponent(CollisionAutoTestMBH).direction.normalizeInPlace();
            }
        }
    }
    static RunPhysicTest() {
        let canvas = document.getElementById("render-canvas-physic");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 512;
            canvas.height = 512;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let g = new Alviss.GameObject(scene);
            g.transform.position.x = Math.random() * engine.width;
            g.transform.position.y = Math.random() * engine.height;
            g.AddComponent(Alviss.SpriteRenderer);
            g.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(16, 256, 0, 0, 256);
            g.AddComponent(Alviss.DiscCollider);
            g.GetComponent(Alviss.DiscCollider).radius = 16;
            g.AddComponent(Alviss.RigidBody);
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
    Start() {
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
    Update() {
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
    Update() {
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
