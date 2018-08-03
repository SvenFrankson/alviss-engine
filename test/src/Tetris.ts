class Tetris {

    public static RunTetrisTest(): void {
        let canvas = document.getElementById("render-canvas-tetris");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 128;
            canvas.height = 128;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);

            let camera = new Alviss.GameObject(scene);
            camera.AddComponent(Alviss.Camera);
            
            let piece = new Alviss.GameObject(scene);
            piece.AddComponent(LPiece);
            piece.transform.setLocalPosition(0, 60);

            console.log(".");
        }
    }

    public static RunTetrisPhysicTest(): void {
        let canvas = document.getElementById("render-canvas-tetris-physic");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 128;
            canvas.height = 128;
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
            floor.transform.setLocalPosition(0, - engine.height * 0.5 + 8);

            let lShape = new Alviss.GameObject(scene);
            lShape.transform.localAngle = Math.random() * Math.PI * 2;
            
            let lShapeParts: Alviss.GameObject[] = [];
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
                        part.GetComponent(LShapePart).originDistances.push(
                            Alviss.Vector2.Distance(
                                part.transform.getWorldPosition(),
                                other.transform.getWorldPosition()
                            )
                        );
                        console.log(" i " + i + " j " + j + " " +
                            Alviss.Vector2.Distance(
                                part.transform.getWorldPosition(),
                                other.transform.getWorldPosition()
                            )
                        )
                    }
                }
            }
        }
    }
}

class LShapePart extends Alviss.MonoBehaviour {

    public others: LShapePart[] = [];
    public originDistances: number[] = [];

    public FixedUpdate(): void {
        for (let i = 0; i < this.others.length; i++) {
            let other = this.others[i];
            this.gameObject.rigidBody.AddForce(
                other.transform.getWorldPosition().subtract(this.transform.getWorldPosition()).normalizeInPlace().scaleInPlace(
                    (Alviss.Vector2.Distance(
                        other.transform.getWorldPosition(),
                        this.transform.getWorldPosition()
                    ) - this.originDistances[i] * 1.5) * 0.0001
                )
            );
        }
    }
}

class Piece extends Alviss.MonoBehaviour {

    public speed: number = 8;
    public rotationSpeed: number = Math.PI;

    public Update(): void {
        let xAligned = false;
        this.transform.Translate(0, - this.speed / 60);
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.transform.Translate(this.speed / 60, 0);
        }
        else if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.transform.Translate(- this.speed / 60, 0);
        }
        else {
            let deltaX = this.transform.getLocalPosition().x % 6;
            while (deltaX < 0) {
                deltaX += 6;
            }
            if (deltaX > 3) {
                this.transform.Translate(
                    Math.min(this.speed / 60, deltaX),
                    0
                );
            }
            else if (deltaX > 0.01) {
                this.transform.Translate(
                    - Math.min(this.speed / 60, deltaX),
                    0
                );
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
            this.transform.Rotate(- this.rotationSpeed / 60);
        }
        else {
            let deltaA = this.transform.localAngle % (Math.PI * 0.5);
            while (deltaA < 0) {
                deltaA += Math.PI * 0.5;
            }
            if (deltaA > Math.PI * 0.25) {
                this.transform.Rotate(
                    Math.min(this.rotationSpeed / 60, deltaA)
                );
            }
            else if (deltaA > Math.PI * 0.25 * 0.01) {
                this.transform.Rotate(
                    - Math.min(this.rotationSpeed / 60, deltaA)
                );
            }
            else {
                aAligned = true;
            }
        }
    }
}

class LPiece extends Piece {

    public blocks: Block[] = [];

    public Start(): void {
        this.blocks[0] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[0].transform.parent = this.transform;

        this.blocks[1] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[1].transform.parent = this.transform;
        this.blocks[1].transform.setLocalPosition(0, - 6);

        this.blocks[2] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[2].transform.parent = this.transform;
        this.blocks[2].transform.setLocalPosition(0, - 12);

        this.blocks[2] = Block.Create(this.scene, 255, 0, 255);
        this.blocks[2].transform.parent = this.transform;
        this.blocks[2].transform.setLocalPosition(6, 0);
    }
}

class Block extends Alviss.MonoBehaviour {

    public red: number;
    public green: number;
    public blue: number;

    public static Create(scene: Alviss.Scene, red: number, green: number, blue: number): Block {
        let g = new Alviss.GameObject(scene);
        let block = g.AddComponent(Block);
        block.red = red;
        block.green = green;
        block.blue = blue;
        return block;
    }

    public Start(): void {
        if (!this.gameObject.spriteRenderer) {
            this.gameObject.AddComponent(Alviss.SpriteRenderer);
        }
        this.gameObject.spriteRenderer.sprite = Alviss.SpriteTools.CreateSprite(
            `
                888888
                888884
                886674
                886674
                887774
                844444
            `,
            this.red,
            this.green,
            this.blue,
            255
        );
    }

    public serialize(): any {
        return {
            r: this.red,
            g: this.green,
            b: this.blue
        }
    }

    public deserialize(data: any) {
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