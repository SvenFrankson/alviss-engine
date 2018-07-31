/// <reference path="../../dist/alviss.d.ts"/>

class Main {

    public static Run(): void {
        Main.RunSnake();
        Main.RunCollisionTest();
        Main.RunCollisionAutoTest();
        Main.RunPhysicTest();
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
            g.transform.position.x = 25;
            g.transform.position.y = 30;
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

    public static RunCollisionAutoTest(): void {
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

    public static RunPhysicTest(): void {
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