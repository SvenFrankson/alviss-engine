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
        Main.RunInstantiateTest();
        Main.RunPixelTest();
        Tetris.RunTetrisTest();
        Tetris.RunTetrisPhysicTest();
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
            g.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(16, 0, 0, 255, 255);
            g.transform.setWorldPosition(16, 16);
            g.AddComponent(Alviss.DiscCollider);
            g.GetComponent(Alviss.DiscCollider).radius = 8;
            g.AddComponent(CollisionTestMBH);
            let o = new Alviss.GameObject(scene);
            o.AddComponent(Alviss.SpriteRenderer);
            o.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(16, 255, 0, 0, 255);
            o.transform.setWorldPosition(64, 64);
            o.AddComponent(Alviss.DiscCollider);
            o.GetComponent(Alviss.DiscCollider).radius = 8;
        }
    }
    static RunCollisionAutoTest() {
        let canvas = document.getElementById("render-canvas-collision-auto");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 255;
            canvas.height = 255;
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
            let player = new Alviss.GameObject(scene);
            player.transform.setWorldPosition((Math.random() - 0.5) * engine.width, (Math.random() - 0.5) * engine.height);
            player.AddComponent(Alviss.SpriteRenderer);
            player.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(8, 0, 255, 0, 255);
            player.AddComponent(Alviss.DiscCollider);
            player.GetComponent(Alviss.DiscCollider).radius = 8;
            player.AddComponent(Alviss.RigidBody);
            player.AddComponent(PlayerControl);
            for (let i = 0; i < 5; i++) {
                let ball = new Alviss.GameObject(scene);
                ball.transform.setWorldPosition((Math.random() - 0.5) * engine.width, (Math.random() - 0.5) * engine.height);
                ball.AddComponent(Alviss.SpriteRenderer);
                ball.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(8, 0, 0, 255, 255);
                ball.AddComponent(Alviss.DiscCollider);
                ball.AddComponent(Alviss.RigidBody);
            }
            for (let i = 0; i < 5; i++) {
                let cube = new Alviss.GameObject(scene);
                cube.transform.setWorldPosition((Math.random() - 0.5) * engine.width, (Math.random() - 0.5) * engine.height);
                cube.AddComponent(Alviss.SpriteRenderer);
                cube.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(32, 32, 255, 0, 0, 255);
                cube.AddComponent(Alviss.RectangleCollider);
                cube.AddComponent(Alviss.RigidBody);
            }
            let ground = new Alviss.GameObject(scene);
            ground.transform.setLocalPosition(0, -engine.height * 0.5);
            ground.AddComponent(Alviss.SpriteRenderer);
            ground.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(engine.width, 16, 255, 255, 0, 255);
            ground.AddComponent(Alviss.RectangleCollider);
            ground.GetComponent(Alviss.RectangleCollider).width = engine.width;
            ground.GetComponent(Alviss.RectangleCollider).height = 16;
        }
    }
    static RunTransformTest() {
        let canvas = document.getElementById("render-canvas-transform");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 255;
            canvas.height = 255;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            let movingUpNDown = new Alviss.GameObject(scene);
            movingUpNDown.AddComponent(Alviss.SpriteRenderer);
            movingUpNDown.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(32, 32, 255, 255, 0, 255);
            movingUpNDown.AddComponent(MovingUpNDown);
            let lock1 = new Alviss.GameObject(scene);
            lock1.AddComponent(Alviss.SpriteRenderer);
            lock1.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(16, 16, 255, 0, 0, 255);
            lock1.AddComponent(ForcedInPlaceMBH);
            lock1.GetComponent(ForcedInPlaceMBH).lockedWorldPosition = new Alviss.Vector2(-32, 32);
            lock1.transform.parent = movingUpNDown.transform;
            let rotating = new Alviss.GameObject(scene);
            rotating.AddComponent(Alviss.SpriteRenderer);
            rotating.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(64, 16, 255, 0, 255, 255);
            rotating.AddComponent(Rotating);
            rotating.transform.setWorldPosition(64, 32);
            let lock2 = new Alviss.GameObject(scene);
            lock2.AddComponent(Alviss.SpriteRenderer);
            lock2.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(16, 16, 255, 0, 0, 255);
            lock2.AddComponent(ForcedInPlaceMBH);
            lock2.GetComponent(ForcedInPlaceMBH).lockedWorldPosition = new Alviss.Vector2(-32, -32);
            lock2.transform.parent = rotating.transform;
            let clone = Alviss.GameObject.Instantiate(rotating);
            clone.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(64, 16, 255, 0, 255, 255);
            clone.transform.setWorldPosition(-64, 32);
        }
    }
    static RunInstantiateTest() {
        let canvas = document.getElementById("render-canvas-instantiate");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 512;
            canvas.height = 512;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            let prefab = new Alviss.GameObject(engine);
            prefab.AddComponent(Alviss.SpriteRenderer);
            prefab.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(8, 0, 255, 0, 255);
            prefab.AddComponent(Alviss.DiscCollider);
            prefab.GetComponent(Alviss.DiscCollider).radius = 8;
            prefab.AddComponent(Alviss.RigidBody);
            prefab.AddComponent(SpawnedMBH);
            let spawner = new Alviss.GameObject(scene);
            spawner.transform.worldAngle = Math.PI / 8;
            spawner.AddComponent(Alviss.SpriteRenderer);
            spawner.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(32, 8, 255, 0, 0, 255);
            spawner.AddComponent(MoveAroundMBH);
            spawner.AddComponent(SpawnMBH);
            spawner.GetComponent(SpawnMBH).template = prefab;
            for (let i = 0; i < 20; i++) {
                let cube = new Alviss.GameObject(scene);
                cube.transform.setWorldPosition((Math.random() - 0.5) * engine.width, Math.random() * engine.height * 0.5 - engine.height * 0.5);
                cube.transform.worldAngle = Math.random() * Math.PI * 2;
                cube.AddComponent(Alviss.SpriteRenderer);
                let h = Math.floor(Math.random() * 96 + 32);
                let w = Math.floor(Math.random() * 24 + 8);
                cube.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(w, h, 0, 0, 255, 255);
                cube.AddComponent(Alviss.RectangleCollider);
                cube.GetComponent(Alviss.RectangleCollider).width = w;
                cube.GetComponent(Alviss.RectangleCollider).height = h;
            }
        }
    }
    static RunPixelTest() {
        let canvas = document.getElementById("render-canvas-pixel");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 32;
            canvas.height = 32;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            let spawner = new Alviss.GameObject(scene);
            spawner.AddComponent(Alviss.SpriteRenderer);
            spawner.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(1, 1, 255, 255, 0, 255);
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
        this.transform.setLocalPosition(Math.sin(this._k / 600 * Math.PI * 2) * this.engine.width * 0.5, Math.sin(this._k / 300 * Math.PI * 2) * this.engine.height * 0.25 + this.engine.height * 0.25);
    }
}
class SpawnMBH extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this._k = 0;
    }
    Update() {
        this._k++;
        if (this._k > 23) {
            this._k++;
            let obj = Alviss.GameObject.Instantiate(this.template, this.transform.getLocalPosition(), 0);
            obj.rigidBody.mass = Math.random() * 5;
            this._k = 0;
        }
    }
}
class SpawnedMBH extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this._k = 0;
    }
    Update() {
        if (this._k++ > 300) {
            this.gameObject.destroy();
        }
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
class PlayerControl extends Alviss.MonoBehaviour {
    FixedUpdate() {
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Up)) {
            this.gameObject.rigidBody.AddForce(new Alviss.Vector2(0, 0.0001));
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Down)) {
            this.gameObject.rigidBody.AddForce(new Alviss.Vector2(0, -0.0001));
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.gameObject.rigidBody.AddForce(new Alviss.Vector2(0.0001, 0));
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.gameObject.rigidBody.AddForce(new Alviss.Vector2(-0.0001, 0));
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
class Tetris {
    static RunTetrisTest() {
        let canvas = document.getElementById("render-canvas-tetris");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 512;
            canvas.height = 512;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            let piece = new Alviss.GameObject(scene);
            piece.AddComponent(LPiece);
            piece.transform.setLocalPosition(0, 200);
            console.log(".");
        }
    }
    static RunTetrisPhysicTest() {
        let canvas = document.getElementById("render-canvas-tetris-physic");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 512;
            canvas.height = 512;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            let floor = new Alviss.GameObject(scene);
            floor.AddComponent(Alviss.SpriteRenderer);
            floor.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(engine.width, 8, 0, 255, 0, 255);
            floor.AddComponent(Alviss.RectangleCollider);
            floor.GetComponent(Alviss.RectangleCollider).width = engine.width;
            floor.GetComponent(Alviss.RectangleCollider).height = 8;
            floor.transform.setLocalPosition(0, -engine.height * 0.5 + 8);
            let lShape = new Alviss.GameObject(scene);
            lShape.transform.localAngle = Math.random() * Math.PI * 2;
            let lShapeParts = [];
            lShapeParts[0] = new Alviss.GameObject(scene);
            lShapeParts[0].transform.parent = lShape.transform;
            lShapeParts[0].AddComponent(Alviss.SpriteRenderer);
            lShapeParts[0].spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(8, 8, 200, 50, 120, 256);
            lShapeParts[0].AddComponent(Alviss.RectangleCollider);
            lShapeParts[0].GetComponent(Alviss.RectangleCollider).width = 8;
            lShapeParts[0].GetComponent(Alviss.RectangleCollider).height = 8;
            lShapeParts[0].AddComponent(Alviss.RigidBody);
            lShapeParts[0].transform.setLocalPosition(0, 32);
            lShapeParts[1] = new Alviss.GameObject(scene);
            lShapeParts[1].transform.parent = lShape.transform;
            lShapeParts[1].AddComponent(Alviss.SpriteRenderer);
            lShapeParts[1].spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(8, 8, 200, 50, 120, 256);
            lShapeParts[1].AddComponent(Alviss.RectangleCollider);
            lShapeParts[1].GetComponent(Alviss.RectangleCollider).width = 8;
            lShapeParts[1].GetComponent(Alviss.RectangleCollider).height = 8;
            lShapeParts[1].AddComponent(Alviss.RigidBody);
            lShapeParts[1].transform.setLocalPosition(8, 32);
            /*
            lShapeParts[2] = new Alviss.GameObject(scene);
            lShapeParts[2].transform.parent = lShape.transform;
            lShapeParts[2].AddComponent(Alviss.SpriteRenderer);
            lShapeParts[2].spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(8, 8, 200, 50, 120, 256);
            lShapeParts[2].AddComponent(Alviss.RectangleCollider);
            lShapeParts[2].GetComponent(Alviss.RectangleCollider).width = 8;
            lShapeParts[2].GetComponent(Alviss.RectangleCollider).height = 8;
            lShapeParts[2].AddComponent(Alviss.RigidBody);
            lShapeParts[2].transform.setLocalPosition(16, 32);

            lShapeParts[3] = new Alviss.GameObject(scene);
            lShapeParts[3].transform.parent = lShape.transform;
            lShapeParts[3].AddComponent(Alviss.SpriteRenderer);
            lShapeParts[3].spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(8, 8, 200, 50, 120, 256);
            lShapeParts[3].AddComponent(Alviss.RectangleCollider);
            lShapeParts[3].GetComponent(Alviss.RectangleCollider).width = 8;
            lShapeParts[3].GetComponent(Alviss.RectangleCollider).height = 8;
            lShapeParts[3].AddComponent(Alviss.RigidBody);
            lShapeParts[3].transform.setLocalPosition(16, 40);
            */
            for (let i = 0; i < lShapeParts.length; i++) {
                let part = lShapeParts[i];
                part.AddComponent(LShapePart);
            }
            for (let i = 0; i < lShapeParts.length; i++) {
                let part = lShapeParts[i];
                for (let j = 0; j < lShapeParts.length; j++) {
                    if (i !== j) {
                        let other = lShapeParts[j].GetComponent(LShapePart);
                        part.GetComponent(LShapePart).others.push(other);
                        part.GetComponent(LShapePart).originDistances.push(Alviss.Vector2.Distance(part.transform.getWorldPosition(), other.transform.getWorldPosition()));
                        console.log(" i " + i + " j " + j + " " +
                            Alviss.Vector2.Distance(part.transform.getWorldPosition(), other.transform.getWorldPosition()));
                    }
                }
            }
        }
    }
}
class LShapePart extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this.others = [];
        this.originDistances = [];
    }
    FixedUpdate() {
        for (let i = 0; i < this.others.length; i++) {
            let other = this.others[i];
            this.gameObject.rigidBody.AddForce(other.transform.getWorldPosition().subtract(this.transform.getWorldPosition()).normalizeInPlace().scaleInPlace((Alviss.Vector2.Distance(other.transform.getWorldPosition(), this.transform.getWorldPosition()) - this.originDistances[i] * 1.5) * 0.0001));
        }
    }
}
class Piece extends Alviss.MonoBehaviour {
    constructor() {
        super(...arguments);
        this.speed = 32;
        this.rotationSpeed = Math.PI;
    }
    Update() {
        let xAligned = false;
        this.transform.Translate(0, -this.speed / 60);
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.transform.Translate(this.speed / 60, 0);
        }
        else if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.transform.Translate(-this.speed / 60, 0);
        }
        else {
            let deltaX = this.transform.getLocalPosition().x % (6 * 4);
            while (deltaX < 0) {
                deltaX += 6 * 4;
            }
            if (deltaX > 3 * 4) {
                this.transform.Translate(Math.min(this.speed / 60, deltaX), 0);
            }
            else if (deltaX > 0.01) {
                this.transform.Translate(-Math.min(this.speed / 60, deltaX), 0);
            }
            else {
                xAligned = true;
            }
        }
        let aAligned = false;
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.A)) {
            this.transform.Rotate(this.rotationSpeed / 60);
        }
        else if (this.engine.input.getPadButtonDown(Alviss.PadButton.B)) {
            this.transform.Rotate(-this.rotationSpeed / 60);
        }
        else {
            let deltaA = this.transform.localAngle % (Math.PI * 0.5);
            while (deltaA < 0) {
                deltaA += Math.PI * 0.5;
            }
            if (deltaA > Math.PI * 0.25) {
                this.transform.Rotate(Math.min(this.rotationSpeed / 60, deltaA));
            }
            else if (deltaA > Math.PI * 0.25 * 0.01) {
                this.transform.Rotate(-Math.min(this.rotationSpeed / 60, deltaA));
            }
            else {
                aAligned = true;
            }
        }
    }
}
class LPiece extends Piece {
    constructor() {
        super(...arguments);
        this.blocks = [];
    }
    Start() {
        this.blocks[0] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[0].transform.parent = this.transform;
        this.blocks[1] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[1].transform.parent = this.transform;
        this.blocks[1].transform.setLocalPosition(0, -6 * 4);
        this.blocks[2] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[2].transform.parent = this.transform;
        this.blocks[2].transform.setLocalPosition(0, -12 * 4);
        this.blocks[2] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[2].transform.parent = this.transform;
        this.blocks[2].transform.setLocalPosition(6 * 4, 0);
    }
}
class Block extends Alviss.MonoBehaviour {
    static Create(scene, red, green, blue) {
        let g = new Alviss.GameObject(scene);
        let block = g.AddComponent(Block);
        block.red = red;
        block.green = green;
        block.blue = blue;
        return block;
    }
    Start() {
        if (!this.gameObject.spriteRenderer) {
            this.gameObject.AddComponent(Alviss.SpriteRenderer);
        }
        this.gameObject.spriteRenderer.sprite = Alviss.SpriteTools.CreateSprite(`
                888888
                888884
                886674
                886674
                887774
                844444
            `, this.red, this.green, this.blue, 255, 4);
    }
    serialize() {
        return {
            r: this.red,
            g: this.green,
            b: this.blue
        };
    }
    deserialize(data) {
        if (data) {
            if (isFinite(data.r)) {
                this.red = data.r;
            }
            if (isFinite(data.g)) {
                this.green = data.g;
            }
            if (isFinite(data.b)) {
                this.blue = data.b;
            }
        }
    }
}
