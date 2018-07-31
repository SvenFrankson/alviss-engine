module Alviss {

    export class Scene {

        private physicEngine: Matter.Engine;
        public get physicWorld(): Matter.World {
            return this.physicEngine.world;
        }
        public objects: List<GameObject> = new List<GameObject>();
        public colliders: List<Collider> = new List<Collider>();
        public rigidBodies: List<RigidBody> = new List<RigidBody>();

        constructor(public engine: Engine) {
            this.engine.scenes.push(this);
            this.physicEngine = Matter.Engine.create();
            this.physicWorld.gravity.y = -1;
        }

        public destroy(): void {
            this.engine.scenes.remove(this);
        }

        public updatePhysic(): void {
            Matter.Engine.update(this.physicEngine, 1000 / 60);
            this.rigidBodies.forEach(
                (r) => {
                    r._update();
                }
            )
        }

        public update(): void {
            this.colliders.forEach(
                (c) => {
                    this.colliders.forEach(
                        (other) => {
                            if (c !== other) {
                                let collision = c.intersects(other);
                                if (collision) {
                                    c.collisions.push(collision);
                                }
                            }
                        }
                    )
                }
            );
            this.colliders.forEach(
                (c) => {
                    c._update();
                }
            );
            this.objects.forEach(
                (g) => {
                    g.monoBehaviours.forEach(
                        (m) => {
                            m._update();
                        }
                    )
                }
            );
        }

        public render(): void {
            this.objects.sort((g1, g2) => { return g1.transform.depth - g2.transform.depth; });
            this.objects.forEach(
                (g) => {
                    if (g.spriteRenderer) {
                        this.engine.context.drawImage(
                            g.spriteRenderer.sprite.image,
                            Math.round(g.transform.position.x - g.spriteRenderer.sprite.image.width * 0.5),
                            Math.round(this.engine.height - (g.transform.position.y + g.spriteRenderer.sprite.image.height * 0.5))
                        );
                    }
                }
            );
        }
    }
}