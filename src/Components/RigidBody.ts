module Alviss {

    export class RigidBody extends Component {

        private _body: Matter.Body;
        public collider: Collider;

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.collider = this.GetComponent(Collider);
            this.scene.rigidBodies.push(this);
        }

        public destroy(): void {
            this.scene.rigidBodies.remove(this);
        }

        private _createBody(): void {
            if (this.collider instanceof DiscCollider) {
                this._body = Matter.Bodies.circle(this.transform.position.x, this.transform.position.y, this.collider.radius);
                Matter.World.add(this.scene.physicWorld, [this._body]);
            }
        }

        public _update(): void {
            if (!this._body) {
                this._createBody();
            }
            if (this._body) {
                this.transform.position.x = this._body.position.x;
                this.transform.position.y = this._body.position.y;
            }
        }
    }
}