module Alviss {

    export class RigidBody extends Component {

        public collider: Collider;
        private _mass: number = 1;
        public get mass(): number {
            return this._mass;
        }
        public set mass(v: number) {
            this._mass = v;
            if (this.gameObject._body) {
               Matter.Body.setMass(this.gameObject._body, v);
            }
        }

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
                    Matter.Body.setAngle(this.gameObject._body, - this.transform.worldAngle);
                    Matter.Body.setMass(this.gameObject._body, this.mass);
                    Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
                }
                else if (this.collider instanceof RectangleCollider) {
                    this.gameObject._body = Matter.Bodies.rectangle(worldPosition.x, worldPosition.y, this.collider.width, this.collider.height);
                    Matter.Body.setAngle(this.gameObject._body, - this.transform.worldAngle);
                    Matter.Body.setMass(this.gameObject._body, this.mass);
                    Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
                }
            }
        }

        public _update(): void {
            if (!this.gameObject._body) {
                this._createBody();
            }
            if (this.gameObject._body) {
                this.transform.setWorldPosition(this.gameObject._body.position.x, this.gameObject._body.position.y);
                this.transform.worldAngle = this.gameObject._body.angle;
            }
        }
    }
}