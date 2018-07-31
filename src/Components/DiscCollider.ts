module Alviss {

    export class DiscCollider extends Collider {

        public radius: number;

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "DiscCollider";
            this.radius = 8;
        }

        public intersects(other: Collider): Collision {
            if (other instanceof DiscCollider) {
                return this.intersectsDisc(other);
            }
            if (other instanceof SquareCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }

        private intersectsDisc(other: DiscCollider): Collision {
            let radiusSumSquared = this.radius * this.radius + other.radius * other.radius;
            if (Vector2.DistanceSquared(this.worldPosition, other.worldPosition) < radiusSumSquared) {
                let collision = new Collision(other);
                collision.contact = this.worldPosition.subtract(other.worldPosition);
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.worldPosition);
                return collision;
            }
            return undefined;
        }

        private _tmpProject: Vector2 = Vector2.Zero();
        private intersectsSquare(other: SquareCollider): Collision {
            this._tmpProject.copyFrom(this.worldPosition);
            this._tmpProject.clampXInPlace(other.x0, other.x1);
            this._tmpProject.clampYInPlace(other.y0, other.y1);
            if (Vector2.DistanceSquared(this.worldPosition, this._tmpProject) < this.radius * this.radius) {
                let collision = new Collision(other);
                collision.contact = this._tmpProject.clone();
            }
            return undefined;
        }
    }
}