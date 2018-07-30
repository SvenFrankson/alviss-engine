module Alviss {

    export class Component {

        public name: string;
        public gameObject: GameObject;
        public get scene(): Scene {
            return this.gameObject.scene;
        }
        public get transform(): Transform {
            return this.gameObject.transform;
        }

        constructor(gameObject: GameObject) {
            this.gameObject = gameObject;
        }

        public GetComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T {
            return this.gameObject.GetComponent<T>(TConstructor);
        }

        public GetComponents<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T[] {
            return this.gameObject.GetComponents<T>(TConstructor);
        }
    }
}