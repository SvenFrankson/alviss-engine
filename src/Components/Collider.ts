module Alviss {

    export class Collider extends Component {

        public localPosition: Vector2 = Vector2.Zero();
        private _worldPosition: Vector2 = Vector2.Zero();
        public get worldPosition(): Vector2 {
            this._worldPosition.copyFrom(this.gameObject.transform.position).addInPlace(this.localPosition);
            return this._worldPosition;
        }
        public set worldPosition(p: Vector2) {
            this.localPosition.copyFrom(p).subtractInPlace(this.gameObject.transform.position); 
        }

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "Collider";
            this.localPosition = Vector2.Zero();
            this.scene.colliders.push(this);
        }

        public destroy(): void {
            this.scene.colliders.remove(this);
        }

        public intersects(other: Collider): Collision {
            return undefined;
        }

        private _lastCollisions: List<Collision> = new List<Collision>();
        public collisions: List<Collision> = new List<Collision>();
        public _update(): void {
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