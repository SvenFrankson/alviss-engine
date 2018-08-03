/*
    name	The name of the object.
    Public Methods
    GetInstanceID	Returns the instance id of the object.
    ToString	Returns the name of the GameObject.
    Static Methods
    Destroy	Removes a gameobject, component or asset.
    DestroyImmediate	Destroys the object obj immediately. You are strongly recommended to use Destroy instead.
    DontDestroyOnLoad	Makes the object target not be destroyed automatically when loading a new scene.
    FindObjectOfType	Returns the first active loaded object of Type type.
    FindObjectsOfType	Returns a list of all active loaded objects of Type type.
    Instantiate	Clones the object original and returns the clone.
*/

module Alviss {

    export class Object {

        private static _ids: number = 0;
        private static _newId(): number {
            return Object._ids++;
        }
        public name: string;

        public static Destroy(o: Object): void {
            o.destroy();
        }

        public static Instantiate(o: Object): Object;
        public static Instantiate(o: Object, parent: Transform): Object;
        public static Instantiate(o: Object, parent: Transform, instantiateInWorldSpace: boolean): Object;
        public static Instantiate(o: Object, position: Vector2, angle: number): Object;
        public static Instantiate(o: Object, position: Vector2, angle: number, parent: Transform): Object;
        public static Instantiate(o: Object, a?: Transform | Vector2, b?: boolean | number, parent?: Transform): Object {
            if (!a) {
                return o.instantiate();
            }
            if (a instanceof Transform) {
                return o.instantiate(a, b as boolean);
            }
            if (a instanceof Vector2) {
                return o.instantiate(a, b as number, parent);
            }
        }

        public destroy(): void {}

        public destroyImmediate(): void {}

        public instantiate(): Object;
        public instantiate(parent: Transform): Object;
        public instantiate(parent: Transform, instantiateInWorldSpace: boolean): Object;
        public instantiate(position: Vector2, angle: number): Object;
        public instantiate(position: Vector2, angle: number, parent: Transform): Object;
        public instantiate(a?: Transform | Vector2, b?: boolean | number, parent?: Transform): Object {
            return new Object();
        }
    }
}