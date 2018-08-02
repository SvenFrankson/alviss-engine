class CollisionTestMBH extends Alviss.MonoBehaviour {

    public Update(): void {
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

    public OnCollisionEnter(collision: Alviss.Collision): void {
        console.log("Collision Enter");
    }

    public OnCollisionStay(collision: Alviss.Collision): void {
        console.log("Collision Stay");
    }

    public OnCollisionExit(collision: Alviss.Collision): void {
        console.log("Collision Exit");
    }
}

class CollisionAutoTestMBH extends Alviss.MonoBehaviour {

    public direction: Alviss.Vector2 = Alviss.Vector2.Zero();
    public radius: number = 8;

    public Start(): void {
        this.gameObject.AddComponent(Alviss.SpriteRenderer);
        this.gameObject.spriteRenderer.sprite = Alviss.SpriteTools.CreateDiscSprite(this.radius, 0, 64 * Math.random(), 256 * Math.random(), 256);
        this.GetComponent(Alviss.DiscCollider).radius = this.radius;
    }

    public Update(): void {
        this.transform.Translate(this.direction.scale(0.75));
        if (this.transform.getWorldPosition().x - this.radius <= 0 && this.direction.x < 0) {
            this.direction.multiplyInPlace(- 1, 1);
        }
        if (this.transform.getWorldPosition().x + this.radius > this.engine.width && this.direction.x > 0) {
            this.direction.multiplyInPlace(- 1, 1);
        }
        if (this.transform.getWorldPosition().y - this.radius <= 0 && this.direction.y < 0) {
            this.direction.multiplyInPlace(1, - 1);
        }
        if (this.transform.getWorldPosition().y + this.radius > this.engine.height && this.direction.y > 0) {
            this.direction.multiplyInPlace(1, - 1);
        }
    }

    public OnCollisionEnter(collision: Alviss.Collision): void {
        let n = this.transform.getWorldPosition().clone().subtractInPlace(collision.contact);
        this.direction.mirrorInPlace(n);
    }

    public OnCollisionStay(collision: Alviss.Collision): void {}

    public OnCollisionExit(collision: Alviss.Collision): void {}
}