module Alviss {

    export class Vector2 {

        constructor(
            public x: number = 0,
            public y: number = 0
        ) {

        }

        public static Zero(): Vector2 {
            return new Vector2(0, 0);
        }
    }
}