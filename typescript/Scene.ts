class Scene {

    public objects: List<GameObject> = new List<GameObject>();

    constructor(public engine: Engine) {
        this.engine.scenes.push(this);
    }

    public destroy(): void {
        this.engine.scenes.remove(this);
    }

    public update(): void {
        this.objects.forEach(
            (g) => {
                g.monoBehaviours.forEach(
                    (m) => {
                        m.update();
                    }
                )
            }
        );
    }

    public render(): void {
        this.objects.sort((g1, g2) => { return g1.transform.depth - g2.transform.depth; });
        this.objects.forEach(
            (g) => {
                this.engine.context.putImageData(g.currentSprite, g.transform.dx, this.engine.height - g.transform.dy);
            }
        );
    }
}