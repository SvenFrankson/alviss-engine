module Alviss {

    export class Camera extends Component {

        public width: number;
        public height: number;

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.width = this.engine.width;
            this.height = this.engine.height;
            if (this.isInstance) {
                this.scene.cameras.push(this);
            }
        }

        public destroy(): void {
            super.destroy();
            if (this.isInstance) {
                this.scene.cameras.remove(this);
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
    }
}