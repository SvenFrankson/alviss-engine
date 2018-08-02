module Alviss {

    export class DiscCollider extends Collider {

        public radius: number;

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "DiscCollider";
            this.radius = 8;
            if (this.gameObject.spriteRenderer) {
                if (this.gameObject.spriteRenderer.sprite) {
                    if (this.gameObject.spriteRenderer.sprite.image) {
                        if (this.gameObject.spriteRenderer.sprite.image.width > 0) {
                            this.radius = this.gameObject.spriteRenderer.sprite.image.width * 0.5;
                        }
                    }
                }
            }
        }

        public serialize(): any {
            return {
                r: this.radius
            };
        }

        public deserialize(data: any) {
            if (data) {
                if (isFinite(data.r)) {
                    this.radius = data.r;
                }
            }
        }

        public intersects(other: Collider): Collision {
            if (other instanceof DiscCollider) {
                return this.intersectsDisc(other);
            }
            if (other instanceof RectangleCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }

        private intersectsDisc(other: DiscCollider): Collision {
            let radiusSumSquared = this.radius * this.radius + other.radius * other.radius;
            if (Vector2.DistanceSquared(this.transform.getWorldPosition(), other.transform.getWorldPosition()) < radiusSumSquared) {
                let collision = new Collision(other);
                collision.contact = this.transform.getWorldPosition().subtract(other.transform.getWorldPosition());
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.transform.getWorldPosition());
                return collision;
            }
            return undefined;
        }

        private _tmpProject: Vector2 = Vector2.Zero();
        private intersectsSquare(other: RectangleCollider): Collision {
            this._tmpProject.copyFrom(this.transform.getWorldPosition());
            this._tmpProject.clampXInPlace(other.x0, other.x1);
            this._tmpProject.clampYInPlace(other.y0, other.y1);
            if (Vector2.DistanceSquared(this.transform.getWorldPosition(), this._tmpProject) < this.radius * this.radius) {
                let collision = new Collision(other);
                collision.contact = this._tmpProject.clone();
            }
            return undefined;
        }
    }
}