module Alviss {

    export class Collider extends Component {

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "Collider";
            if (this.isInstance) {
                this.scene.colliders.push(this);
            }
        }

        public destroy(): void {
            super.destroy();
            if (this.isInstance) {
                this.scene.colliders.remove(this);
            }
        }

        public intersects(other: Collider): Collision {
            return undefined;
        }

        private _createBody(): void {
            let worldPosition = this.transform.getWorldPosition();
            if (this instanceof DiscCollider) {
                this.gameObject._body = Matter.Bodies.circle(worldPosition.x, worldPosition.y, this.radius, {isStatic: true});
                Matter.Body.setAngle(this.gameObject._body, this.transform.worldAngle);
                Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
            }
            else if (this instanceof RectangleCollider) {
                console.log("!");
                this.gameObject._body = Matter.Bodies.rectangle(worldPosition.x, worldPosition.y, this.width, this.height, {isStatic: true});
                Matter.Body.setAngle(this.gameObject._body, this.transform.worldAngle);
                Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
            }
        }

        private _lastCollisions: List<Collision> = new List<Collision>();
        public collisions: List<Collision> = new List<Collision>();
        public _update(): void {
            if (!this.gameObject.rigidBody) {
                if (!this.gameObject._body) {
                    this._createBody();
                }
                else {
                    Matter.Body.setPosition(this.gameObject._body, this.transform.getWorldPosition());
                }
            }
            this.collisions.forEach(
                (collision) => {
                    if (this._lastCollisions.first((lastCollision) => { return collision.collider === lastCollision.collider; })) {
                        this.gameObject._onCollisionStay(collision);
                    }
                    else {
                        this.gameObject._onCollisionEnter(collision);
                    }
                }
            );
            this._lastCollisions.forEach(
                (lastCollision) => {
                    if (!(this.collisions.first((collision) => { return lastCollision.collider === collision.collider; }))) {
                        this.gameObject._onCollisionExit(lastCollision);
                    }
                }
            );
            this._lastCollisions.copyFrom(this.collisions);
            this.collisions.clear();
        }
    }
}