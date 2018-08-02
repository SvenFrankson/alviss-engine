/// <reference path="../../dist/alviss.d.ts"/>

class Main {

    public static Run(): void {
        Main.RunSnake();
        Main.RunCollisionTest();
        Main.RunCollisionAutoTest();
        Main.RunPhysicTest();
        Main.RunTransformTest();
    }

    public static RunSnake(): void {
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

    public static RunCollisionTest(): void {
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

    public static RunCollisionAutoTest(): void {
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

    public static RunPhysicTest(): void {
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
                ball.spriteRenderer.sprite = new Alviss.Sprite("./face.png");
                ball.AddComponent(Alviss.DiscCollider);
                ball.AddComponent(Alviss.RigidBody);
            }

            for (let i = 0; i < 5; i++) {
                let cube = new Alviss.GameObject(scene);
                cube.transform.setWorldPosition((Math.random() - 0.5) * engine.width, (Math.random() - 0) * engine.height);
                cube.AddComponent(Alviss.SpriteRenderer);
                cube.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(32, 32, 256, 0, 0, 256);
                cube.AddComponent(Alviss.RectangleCollider);
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

    public static RunTransformTest(): void {
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
            lock1.GetComponent(ForcedInPlaceMBH).lockedWorldPosition = new Alviss.Vector2(- 32, 32);
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
            lock2.GetComponent(ForcedInPlaceMBH).lockedWorldPosition = new Alviss.Vector2(- 32, - 32);
            lock2.transform.parent = rotating.transform;

            let clone = Alviss.GameObject.Instantiate(rotating) as Alviss.GameObject;
            clone.spriteRenderer.sprite = Alviss.SpriteTools.CreateRectangleSprite(64, 16, 256, 0, 256, 256);
            clone.transform.setWorldPosition(- 64, 32);
        }
    }
}

class MoveAroundMBH extends Alviss.MonoBehaviour {

    private _k: number = 0;
    public Update(): void {
        this._k++;
        this.transform.setWorldPosition(Math.sin(this._k / 600 * Math.PI * 2) * 64, Math.sin(this._k / 300 * Math.PI * 2) * 64);
    }
}

class MovingUpNDown extends Alviss.MonoBehaviour {

    private _k: number = 0;
    public Update(): void {
        this._k++;
        this.transform.setWorldPosition(0, Math.sin(this._k / 300 * Math.PI * 2) * 64);
    }
}

class Rotating extends Alviss.MonoBehaviour {

    private _k: number = 0;
    public Update(): void {
        this._k++;
        this.transform.worldAngle = this._k / 60 * Math.PI * 2;
    }
}

class ForcedInPlaceMBH extends Alviss.MonoBehaviour {

    public lockedWorldPosition: Alviss.Vector2 = Alviss.Vector2.Zero();

    public Update(): void {
        this.transform.setWorldPosition(this.lockedWorldPosition);
    }
}