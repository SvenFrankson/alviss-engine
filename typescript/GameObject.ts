class GameObject {

    private _currentSpriteIndex: number = -1;
    private _sprites: ImageData[] = [];
    public get currentSprite(): ImageData {
        return this._sprites[this._currentSpriteIndex];
    }

    public transform: Transform;
    public monoBehaviours: List<MonoBehaviour> = new List<MonoBehaviour>();
    private _components: List<Component> = new List<Component>();

    constructor(public scene: Scene) {
        this.scene.objects.push(this);
        this.AddComponent(Transform);
    }

    public destroy(): void {
        this.scene.objects.remove(this);
    }

    public addSprite(sprite: ImageData): void {
        this._sprites.push(sprite);
        this._currentSpriteIndex = this._sprites.length - 1;
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
}