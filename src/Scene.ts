module Alviss {

    export class Scene {

        private physicEngine: Matter.Engine;
        public get physicWorld(): Matter.World {
            return this.physicEngine.world;
        }
        public objects: List<GameObject> = new List<GameObject>();
        public bin: List<Object> = new List<Object>();
        public cameras: List<Camera> = new List<Camera>();
        public colliders: List<Collider> = new List<Collider>();
        public rigidBodies: List<RigidBody> = new List<RigidBody>();

        constructor(public engine: Engine) {
            this.engine.scenes.push(this);
            this.physicEngine = Matter.Engine.create();
            this.physicWorld.gravity.y = 0;
        }

        public destroy(): void {
            this.engine.scenes.remove(this);
        }

        public updatePhysic(): void {
            this.objects.forEach(
                (g) => {
                    g.monoBehaviours.forEach(
                        (m) => {
                            m._fixedUpdate();
                        }
                    )
                }
            );
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
            while (this.bin.length > 0) {
                this.bin.pop_last().destroyImmediate();
            }
        }

        public render(): void {
            this.objects.sort((g1, g2) => { return g1.transform.depth - g2.transform.depth; });
            this.objects.forEach(
                (g) => {
                    if (g.spriteRenderer) {
                        g.spriteRenderer._render(this.cameras.get(0));
                    }
                }
            );
        }
    }
}