module Alviss {

    export class GameObject extends Object {

        public _body: Matter.Body;
        public transform: Transform;
        public spriteRenderer: SpriteRenderer;
        public rigidBody: RigidBody;
        public monoBehaviours: List<MonoBehaviour> = new List<MonoBehaviour>();
        public _components: List<Component> = new List<Component>();

        private _engine: Engine;
        public get engine(): Engine {
            return this._engine;
        }
        private _scene: Scene;
        public get scene(): Scene {
            return this._scene;
        }
        public get isPrefab(): boolean {
            return this.scene === undefined;
        }
        public get isInstance(): boolean {
            return this.scene !== undefined;
        }

        constructor(scene: Scene);
        constructor(engine: Engine);
        constructor(location : Scene | Engine) {
            super();
            this.name = "GameObject";
            if (location instanceof Scene) {
                this._scene = location;
                this._engine = this._scene.engine;
            }
            else if (location instanceof Engine) {
                this.name += " [Prefab]";
                this._engine = location;
            }
            this.AddComponent(Transform);
            if (this.isInstance) {
                this.scene.objects.push(this);
            }
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
            if (this._body) {
                Matter.Composite.remove(this.scene.physicWorld, this._body);
            }
            while (this._components.length > 0) {
                this._components.get(0).destroyImmediate();
            }
            if (this.isInstance) {
                this.scene.objects.remove(this);
            }
        }

        public instantiate(a?: Transform | Vector2, b?: boolean | number, parent?: Transform): Object {
            let clone: GameObject;
            
            if (this.isPrefab) {
                clone = new GameObject(this.engine.scenes.get(0));
            }
            if (this.isInstance) {
                clone = new GameObject(this.scene);
            }

            this._components.forEach(
                (c) => {
                    let comp = clone.AddComponent(c.constructor as (new (gameObject: GameObject) => any));
                    if (comp instanceof Component) {
                        comp.deserialize(c.serialize());
                    }
                }
            )

            if (a instanceof Transform) {
                clone.transform.parent = a;
                if (typeof(b) === "boolean") {
                    if (b as boolean) {
                        clone.transform.setWorldPosition(0, 0);
                    } 
                }
            }
            else if (a instanceof Vector2) {
                if (parent instanceof Transform) {
                    clone.transform.parent = parent;
                }
                clone.transform.setLocalPosition(a);
                if (typeof(b) === "number") {
                    clone.transform.localAngle = b as number;
                }
            }

            return clone;
        }

        public AddComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T {
            let component = this.GetComponent(TConstructor);
            if (!component) {
                component = new TConstructor(this);
            }
            return component;
        }

        public GetComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T {
            return this._components.first((c) => { return c instanceof TConstructor; }) as T;
        }

        public GetComponents<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T[] {
            let components: T[] = [];
            for (let i = 0; i < this._components.length; i++) {
                let component = this._components.get(i);
                if (component instanceof TConstructor) {
                    components.push(component);
                }
            }
            return components;
        }

        public _onCollisionEnter(collision: Collision): void {
            this.monoBehaviours.forEach(
                (m) => {
                    m.OnCollisionEnter(collision);
                }
            );
        }

        public _onCollisionStay(collision: Collision): void {
            this.monoBehaviours.forEach(
                (m) => {
                    m.OnCollisionStay(collision);
                }
            );
        }

        public _onCollisionExit(collision: Collision): void {
            this.monoBehaviours.forEach(
                (m) => {
                    m.OnCollisionExit(collision);
                }
            );
        }
    }
}