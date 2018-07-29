class GameObject {

    public position: Vector2;
    public get dx(): number {
        return Math.round(this.position.x - this.currentSprite.width / 2);
    }
    public get dy(): number {
        return Math.round(this.position.y - this.currentSprite.height / 2);
    }
    public depth: number = 0;
    private _currentSpriteIndex: number = -1;
    private _sprites: ImageData[] = [];
    public get currentSprite(): ImageData {
        return this._sprites[this._currentSpriteIndex];
    }

    public monoBehaviours: List<MonoBehaviour> = new List<MonoBehaviour>();

    constructor(public scene: Scene) {
        this.position = Vector2.Zero();
        this.scene.objects.push(this);
    }

    public destroy(): void {
        this.scene.objects.remove(this);
    }

    public addSprite(sprite: ImageData): void {
        this._sprites.push(sprite);
        this._currentSpriteIndex = this._sprites.length - 1;
    }
}