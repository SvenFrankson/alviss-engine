class CollisionTestMBH extends Alviss.MonoBehaviour {
    Update() {
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Up)) {
            this.gameObject.transform.Translate(0, 1);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Down)) {
            this.gameObject.transform.Translate(0, -1);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.gameObject.transform.Translate(1, 0);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.gameObject.transform.Translate(0, 1);
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
        this.transform.Translate(this.direction.scale(0.75));
        if (this.transform.getWorldPosition().x - this.radius <= 0 && this.direction.x < 0) {
            this.direction.multiplyInPlace(-1, 1);
        }
        if (this.transform.getWorldPosition().x + this.radius > this.engine.width && this.direction.x > 0) {
            this.direction.multiplyInPlace(-1, 1);
        }
        if (this.transform.getWorldPosition().y - this.radius <= 0 && this.direction.y < 0) {
            this.direction.multiplyInPlace(1, -1);
        }
        if (this.transform.getWorldPosition().y + this.radius > this.engine.height && this.direction.y > 0) {
            this.direction.multiplyInPlace(1, -1);
        }
    }
    OnCollisionEnter(collision) {
        let n = this.transform.getWorldPosition().clone().subtractInPlace(collision.contact);
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
        Main.RunTransformTest();
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
            g.transform.setWorldPosition(25, 30);
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
            g.transform.setWorldPosition(16, 16);
            g.AddComponent(Alviss.DiscCollider);
            g.GetComponent(Alviss.DiscCollider).radius = 8;
            g.AddComponent(CollisionTestMBH);
            let o = new Alviss.GameObject(scene);
            o.AddComponent(Alviss.SpriteRenderer);
            o.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(16, 256, 0, 0, 256);
            o.transform.setWorldPosition(64, 64);
            o.AddComponent(Alviss.DiscCollider);
            o.GetComponent(Alviss.DiscCollider).radius = 8;
        }
    }
    static RunCollisionAutoTest() {
        let canvas = document.getElementById("render-canvas-collision-auto");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 256;
            canvas.height = 256;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            for (let i = 0; i < 10; i++) {
                let g = new Alviss.GameObject(scene);
                g.transform.setWorldPosition(Math.random() * engine.width, Math.random() * engine.height);
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
            canvas.width = 256;
            canvas.height = 256;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            camera.AddComponent(MoveAroundMBH);
            for (let i = 0; i < 5; i++) {
                let ball = new Alviss.GameObject(scene);
                ball.transform.setWorldPosition((Math.random() - 0.5) * engine.width, (Math.random() - 0) * engine.height);
                ball.AddComponent(Alviss.SpriteRenderer);
                ball.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(16, 256, 0, 0, 256);
                ball.AddComponent(Alviss.DiscCollider);
                ball.GetComponent(Alviss.DiscCollider).radius = 16;
                ball.AddComponent(Alviss.RigidBody);
            }
            for (let i = 0; i < 5; i++) {
                let cube = new Alviss.GameObject(scene);
                cube.transform.setWorldPosition((Math.random() - 0.5) * engine.width, (Math.random() - 0) * engine.height);
                cube.AddComponent(Alviss.SpriteRenderer);
                cube.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(32, 32, 256, 0, 0, 256);
                cube.AddComponent(Alviss.RectangleCollider);
                cube.GetComponent(Alviss.RectangleCollider).width = 32;
                cube.GetComponent(Alviss.RectangleCollider).height = 32;
                cube.AddComponent(Alviss.RigidBody);
            }
            let ground = new Alviss.GameObject(scene);
            ground.AddComponent(Alviss.SpriteRenderer);
            ground.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(engine.width, 16, 256, 256, 0, 256);
            ground.AddComponent(Alviss.RectangleCollider);
            ground.GetComponent(Alviss.RectangleCollider).width = engine.width;
            ground.GetComponent(Alviss.RectangleCollider).height = 16;
        }
    }
    static RunTransformTest() {
        let canvas = document.getElementById("render-canvas-transform");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 256;
            canvas.height = 256;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            let movingUpNDown = new Alviss.GameObject(scene);
            movingUpNDown.AddComponent(Alviss.SpriteRenderer);
            movingUpNDown.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(32, 32, 256, 256, 0, 256);
            movingUpNDown.AddComponent(MovingUpNDown);
            let lock1 = new Alviss.GameObject(scene);
            lock1.AddComponent(Alviss.SpriteRenderer);
            lock1.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(16, 16, 256, 0, 0, 256);
            lock1.AddComponent(ForcedInPlaceMBH);
            lock1.GetComponent(ForcedInPlaceMBH).lockedWorldPosition = new Alviss.Vector2(-32, 32);
            lock1.transform.parent = movingUpNDown.transform;
            let rotating = new Alviss.GameObject(scene);
            rotating.AddComponent(Alviss.SpriteRenderer);
            rotating.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(64, 16, 256, 0, 256, 256);
            rotating.AddComponent(Rotating);
            rotating.transform.setWorldPosition(64, 32);
            let lock2 = new Alviss.GameObject(scene);
            lock2.AddComponent(Alviss.SpriteRenderer);
            lock2.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(16, 16, 256, 0, 0, 256);
            lock2.AddComponent(ForcedInPlaceMBH);
            lock2.GetComponent(ForcedInPlaceMBH).lockedWorldPosition = new Alviss.Vector2(-32, -32);
            lock2.transform.parent = rotating.transform;
            let clone = Alviss.GameObject.Instantiate(rotating);
            clone.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(64, 16, 256, 0, 256, 256);
            clone.transform.setWorldPosition(-64, 32);
        }
    }
}
class MoveAroundMBH extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this._k = 0;
    }
    Update() {
        this._k++;
        this.transform.setWorldPosition(Math.sin(this._k / 600 * Math.PI * 2) * 64, Math.sin(this._k / 300 * Math.PI * 2) * 64);
    }
}
class MovingUpNDown extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this._k = 0;
    }
    Update() {
        this._k++;
        this.transform.setWorldPosition(0, Math.sin(this._k / 300 * Math.PI * 2) * 64);
    }
}
class Rotating extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this._k = 0;
    }
    Update() {
        this._k++;
        this.transform.worldAngle = this._k / 60 * Math.PI * 2;
    }
}
class ForcedInPlaceMBH extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this.lockedWorldPosition = Alviss.Vector2.Zero();
    }
    Update() {
        this.transform.setWorldPosition(this.lockedWorldPosition);
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
        this.gameObject.transform.setWorldPosition(32, 32);
    }
    Update() {
        if (this.engine.input.getPadButton(Alviss.PadButton.Up)) {
            this.direction = new Alviss.Vector2(0, 1);
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Down)) {
            this.direction = new Alviss.Vector2(0, -1);
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Right)) {
            this.direction = new Alviss.Vector2(1, 0);
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Left)) {
            this.direction = new Alviss.Vector2(-1, 0);
        }
        this.t++;
        if (this.t > 60 / this.speed) {
            this.t = 0;
            let lastX = this.gameObject.transform.getWorldPosition().x;
            let lastY = this.gameObject.transform.getWorldPosition().y;
            this.gameObject.transform.Translate(this.direction.scale(8));
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
                newPart.transform.getWorldPosition().x = lastX;
                newPart.transform.getWorldPosition().y = lastY;
                this.parts.push_first(newPart);
                this.speed *= 1.05;
            }
            else {
                for (let i = this.parts.length - 1; i > 0; i--) {
                    let part = this.parts.get(i);
                    let previousPart = this.parts.get(i - 1);
                    part.transform.setWorldPosition(previousPart.transform.getWorldPosition());
                }
                let part0 = this.parts.get(0);
                if (part0) {
                    part0.transform.setWorldPosition(lastX, lastY);
                }
            }
        }
    }
}
class TestMBH1 extends Alviss.MonoBehaviour {
    Update() {
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Up)) {
            this.gameObject.transform.Translate(0, 1);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Down)) {
            this.gameObject.transform.Translate(0, -1);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.gameObject.transform.Translate(1, 0);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.gameObject.transform.Translate(-1, 0);
        }
    }
}
