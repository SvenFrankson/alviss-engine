module Alviss {

    export class SquareCollider extends Collider {

        public size: number;
        public get x0(): number {
            return this.worldPosition.x - this.size * 0.5;
        }
        public get x1(): number {
            return this.worldPosition.x + this.size * 0.5;
        }
        public get y0(): number {
            return this.worldPosition.y - this.size * 0.5;
        }
        public get y1(): number {
            return this.worldPosition.y + this.size * 0.5;
        }

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "SquareCollider";
            this.size = 8;
        }

        public intersects(other: Collider): Collision {
            if (other instanceof DiscCollider) {
                return this.intersectsDisc(other);
            }
            else if (other instanceof SquareCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }

        private _tmpProject: Vector2 = Vector2.Zero();
        private intersectsDisc(other: DiscCollider): Collision {
            this._tmpProject.copyFrom(other.worldPosition);
            this._tmpProject.clampXInPlace(this.x0, this.x1);
            this._tmpProject.clampYInPlace(this.y0, this.y1);
            if (Vector2.DistanceSquared(other.worldPosition, this._tmpProject) < other.radius * other.radius) {
                let collision = new Collision(other);
                collision.contact = this._tmpProject.subtract(other.worldPosition);
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.worldPosition);
            }
            return undefined;
        }

        private intersectsSquare(other: SquareCollider): Collision {
            if (this.x1 < other.x0 || this.x0 > other.x1 || this.y1 < other.y0 || this.y0 > other.y1) {
                return undefined;
            }
            let collision = new Collision(other);
            collision.contact = this.worldPosition.clone();
            collision.contact.clampXInPlace(other.x0, other.x1);
            collision.contact.clampYInPlace(other.y0, other.y1);
            return collision;
        }
    }
}