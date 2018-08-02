module Alviss {

    export class SpriteRenderer extends Component {

        public sprite: Sprite;

        constructor(gameObject: GameObject) {
            super(gameObject);
            gameObject.spriteRenderer = this;
        }

        public destroy(): void {
            super.destroy();
            this.gameObject.spriteRenderer = undefined;
        }

        public serialize(): any {
            return {
                s: this.sprite ? this.sprite.serialize() : undefined
            };
        }

        public deserialize(data: any) {
            if (data) {
                if (data.s) {
                    this.sprite = new Sprite();
                    this.sprite.deserialize(data.s);
                }
            }
        }

        private _screenPosition: Vector2 = Vector2.Zero();
        public _render(camera?: Camera): void {
            this._screenPosition.copyFrom(this.transform.getWorldPosition());
            if (camera) {
                this._screenPosition.subtractInPlace(camera.transform.getWorldPosition());
                this._screenPosition.addInPlace(this.engine.width * 0.5, this.engine.height * 0.5);
            }
            
            this.engine.context.translate(this._screenPosition.x, this.engine.height - this._screenPosition.y);
            this.engine.context.rotate(this.transform.worldAngle);
            this.engine.context.drawImage(this.sprite.image, - this.sprite.image.width * 0.5, - this.sprite.image.height * 0.5);
            this.engine.context.rotate(- this.transform.worldAngle);
            this.engine.context.translate(- this._screenPosition.x, - this.engine.height + this._screenPosition.y);
        }
    }
}