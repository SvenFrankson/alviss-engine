module Alviss {

    export class RectangleCollider extends Collider {

        public width: number;
        public height: number;
        public get x0(): number {
            return this.transform.getWorldPosition().x - this.width * 0.5;
        }
        public get x1(): number {
            return this.transform.getWorldPosition().x + this.width * 0.5;
        }
        public get y0(): number {
            return this.transform.getWorldPosition().y - this.height * 0.5;
        }
        public get y1(): number {
            return this.transform.getWorldPosition().y + this.height * 0.5;
        }

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "SquareCollider";
            this.width = 8;
            this.height = 8;
            if (this.gameObject.spriteRenderer) {
                this.width = this.gameObject.spriteRenderer.sprite.image.width;
                this.height = this.gameObject.spriteRenderer.sprite.image.height;
            }
        }

        public serialize(): any {
            return {
                w: this.width,
                h: this.height
            };
        }

        public deserialize(data: any) {
            if (data) {
                if (isFinite(data.w)) {
                    this.width = data.w;
                }
                if (isFinite(data.h)) {
                    this.height = data.h;
                }
            }
        }

        public intersects(other: Collider): Collision {
            if (other instanceof DiscCollider) {
                return this.intersectsDisc(other);
            }
            else if (other instanceof RectangleCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }

        private _tmpProject: Vector2 = Vector2.Zero();
        private intersectsDisc(other: DiscCollider): Collision {
            this._tmpProject.copyFrom(other.transform.getWorldPosition());
            this._tmpProject.clampXInPlace(this.x0, this.x1);
            this._tmpProject.clampYInPlace(this.y0, this.y1);
            if (Vector2.DistanceSquared(other.transform.getWorldPosition(), this._tmpProject) < other.radius * other.radius) {
                let collision = new Collision(other);
                collision.contact = this._tmpProject.subtract(other.transform.getWorldPosition());
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.transform.getWorldPosition());
            }
            return undefined;
        }

        private intersectsSquare(other: RectangleCollider): Collision {
            if (this.x1 < other.x0 || this.x0 > other.x1 || this.y1 < other.y0 || this.y0 > other.y1) {
                return undefined;
            }
            let collision = new Collision(other);
            collision.contact = this.transform.getWorldPosition().clone();
            collision.contact.clampXInPlace(other.x0, other.x1);
            collision.contact.clampYInPlace(other.y0, other.y1);
            return collision;
        }
    }
}