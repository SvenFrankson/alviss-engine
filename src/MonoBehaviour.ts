module Alviss {

    export abstract class MonoBehaviour extends Component {

        public get scene(): Scene {
            return this.gameObject.scene;
        }
        public get engine(): Engine {
            return this.scene.engine;
        }

        constructor(gameObject: GameObject) {
            super(gameObject);
            gameObject.monoBehaviours.push(this);
        }

        public destroy(): void {
            this.gameObject.monoBehaviours.remove(this);
        }

        private _started: boolean = false;
        public start(): void { };

        public update(): void {
            if (!this._started) {
                this.start();
                this._started = true;
            }
        };
    }
}