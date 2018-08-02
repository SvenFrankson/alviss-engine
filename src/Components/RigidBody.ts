module Alviss {

    export class RigidBody extends Component {

        public collider: Collider;

        constructor(gameObject: GameObject) {
            super(gameObject);
            gameObject.rigidBody = this;
            this.collider = this.GetComponent(Collider);
            if (this.isInstance) {
                this.scene.rigidBodies.push(this);
            }
        }

        public destroy(): void {
            super.destroy();
            this.gameObject.rigidBody = undefined;
            if (this.isInstance) {
                this.scene.rigidBodies.remove(this);
            }
        }

        private _createBody(): void {
            if (this.collider) {
                let worldPosition = this.transform.getWorldPosition();
                if (this.collider instanceof DiscCollider) {
                    this.gameObject._body = Matter.Bodies.circle(worldPosition.x, worldPosition.y, this.collider.radius);
                    Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
                }
                else if (this.collider instanceof RectangleCollider) {
                    this.gameObject._body = Matter.Bodies.rectangle(worldPosition.x, worldPosition.y, this.collider.width, this.collider.height);
                    Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
                }
            }
        }

        public _update(): void {
            if (!this.gameObject._body) {
                this._createBody();
            }
            if (this.gameObject._body) {
                this.transform.setWorldPosition(Vector2.Tmp(this.gameObject._body.position.x, this.gameObject._body.position.y));
                this.transform.worldAngle = this.gameObject._body.angle;
            }
        }
    }
}