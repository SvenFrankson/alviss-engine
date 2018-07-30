class Snake extends Alviss.MonoBehaviour {

    public direction: Alviss.Vector2 = new Alviss.Vector2(1, 0);
    private parts: Alviss.List<Alviss.GameObject> = new Alviss.List<Alviss.GameObject>();
    private t: number = 0;
    public speed: number = 2;

    public start(): void {
        this.gameObject.AddComponent(Alviss.SpriteRenderer);
        this.gameObject.spriteRenderer.sprite = Alviss.SpriteTools.CreateSprite(
            `
                00111100
                01222210
                12333321
                12844821
                12344321
                12333321
                01222210
                00111100
            `,
            256, 256, 0, 256
        );
        this.gameObject.transform.position.x = 8 * 4;
        this.gameObject.transform.position.y = 8 * 4;
    }

    public update(): void {
        super.update();
        if (this.engine.input.getPadButton(Alviss.PadButton.Up)) {
            this.direction.x = 0;
            this.direction.y = 1;
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Down)) {
            this.direction.x = 0;
            this.direction.y = - 1;
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Right)) {
            this.direction.x = 1;
            this.direction.y = 0;
        }
        if (this.engine.input.getPadButton(Alviss.PadButton.Left)) {
            this.direction.x = - 1;
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
                newPart.spriteRenderer.sprite = Alviss.SpriteTools.CreateSprite(
                    `
                        00111100
                        01222210
                        12333321
                        12344321
                        12344321
                        12333321
                        01222210
                        00111100
                    `,
                    256, 256, 0, 256
                );
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