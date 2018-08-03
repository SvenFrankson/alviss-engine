/// <reference path="./Object.ts"/>

module Alviss {

    export class Component extends Object {

        public gameObject: GameObject;
        public get scene(): Scene {
            return this.gameObject.scene;
        }
        public get engine(): Engine {
            return this.gameObject.engine;
        }
        public get transform(): Transform {
            return this.gameObject.transform;
        }

        public get isPrefab(): boolean {
            return this.gameObject.isPrefab;
        }
        public get isInstance(): boolean {
            return this.gameObject.isInstance;
        }

        constructor(gameObject: GameObject) {
            super();
            this.gameObject = gameObject;
            gameObject._components.push(this);
        }

        public destroy(): void {
            if (this.isInstance) {
                this.scene.bin.push(this);
            }
            else if (this.isPrefab) {
                this.destroyImmediate();
            }
        }

        public destroyImmediate(): void {
            this.gameObject._components.remove(this);
        }

        public instantiate(a?: Transform | Vector2, b?: boolean | number, parent?: Transform): Object {
            return this.gameObject.instantiate(a, b, parent);
        }

        public serialize(): any {}

        public deserialize(data: any) {}

        public GetComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T {
            return this.gameObject.GetComponent<T>(TConstructor);
        }

        public GetComponents<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T[] {
            return this.gameObject.GetComponents<T>(TConstructor);
        }
    }
}