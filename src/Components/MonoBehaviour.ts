/// <reference path="../Component.ts"/>

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
            if (this.isInstance) {
                gameObject.monoBehaviours.push(this);
            }
        }

        public destroyImmediate(): void {
            super.destroyImmediate();
            if (this.isInstance) {
                this.gameObject.monoBehaviours.remove(this);
            }
        }

        private _started: boolean = false;
        public Start(): void { };

        public _update(): void {
            if (!this._started) {
                this.Start();
                this._started = true;
            }
            else {
                this.Update();
            }
        }

        public Update(): void {};

        public OnCollisionEnter(collision: Collision): void {};

        public OnCollisionStay(collision: Collision): void {};

        public OnCollisionExit(collision: Collision): void {};
    }
}