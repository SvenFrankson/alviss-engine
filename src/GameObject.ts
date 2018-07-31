module Alviss {

    export class GameObject {

        public transform: Transform;
        public spriteRenderer: SpriteRenderer;
        public monoBehaviours: List<MonoBehaviour> = new List<MonoBehaviour>();
        private _components: List<Component> = new List<Component>();

        public get engine(): Engine {
            return this.scene.engine;
        }

        constructor(public scene: Scene) {
            this.AddComponent(Transform);
            this.scene.objects.push(this);
        }

        public destroy(): void {
            this.scene.objects.remove(this);
        }

        public AddComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T {
            let component = this.GetComponent(TConstructor);
            if (!component) {
                component = new TConstructor(this);
                this._components.push(component);
                if (component instanceof MonoBehaviour) {
                    this.monoBehaviours.push(component);
                }
                if (component instanceof Transform) {
                    this.transform = component;
                }
                if (component instanceof SpriteRenderer) {
                    this.spriteRenderer = component;
                }
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