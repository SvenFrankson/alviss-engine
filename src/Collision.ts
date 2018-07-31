module Alviss {

    export class Collision {

        public contact: Vector2;
        public get gameObject(): GameObject {
            return this.collider.gameObject;
        }

        constructor(
            public collider: Collider
        ) {

        }
    }
}