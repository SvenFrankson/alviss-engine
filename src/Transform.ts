module Alviss {

    export class Transform extends Component {

        public position: Vector2;
        public get dx(): number {
            return Math.round(this.position.x);
        }
        public get dy(): number {
            return Math.round(this.position.y);
        }
        public depth: number = 0;

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "Transform";
            this.position = Vector2.Zero();
        }
    }
}