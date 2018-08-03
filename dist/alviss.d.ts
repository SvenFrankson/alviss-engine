declare module Alviss {
    class Collision {
        collider: Collider;
        contact: Vector2;
        readonly gameObject: GameObject;
        constructor(collider: Collider);
    }
}
declare module Alviss {
    class Object {
        private static _ids;
        private static _newId();
        name: string;
        static Destroy(o: Object): void;
        static Instantiate(o: Object): Object;
        static Instantiate(o: Object, parent: Transform): Object;
        static Instantiate(o: Object, parent: Transform, instantiateInWorldSpace: boolean): Object;
        static Instantiate(o: Object, position: Vector2, angle: number): Object;
        static Instantiate(o: Object, position: Vector2, angle: number, parent: Transform): Object;
        destroy(): void;
        destroyImmediate(): void;
        instantiate(): Object;
        instantiate(parent: Transform): Object;
        instantiate(parent: Transform, instantiateInWorldSpace: boolean): Object;
        instantiate(position: Vector2, angle: number): Object;
        instantiate(position: Vector2, angle: number, parent: Transform): Object;
    }
}
declare module Alviss {
    class Component extends Object {
        gameObject: GameObject;
        readonly scene: Scene;
        readonly engine: Engine;
        readonly transform: Transform;
        readonly isPrefab: boolean;
        readonly isInstance: boolean;
        constructor(gameObject: GameObject);
        destroy(): void;
        destroyImmediate(): void;
        instantiate(a?: Transform | Vector2, b?: boolean | number, parent?: Transform): Object;
        serialize(): any;
        deserialize(data: any): void;
        GetComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T;
        GetComponents<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T[];
    }
}
declare module Alviss {
    class Engine {
        context: CanvasRenderingContext2D;
        width: number;
        height: number;
        scenes: List<Scene>;
        keyboard: KeyBoard;
        pad: Pad;
        input: Input;
        constructor(context: CanvasRenderingContext2D, width: number, height: number);
    }
}
declare module Alviss {
    class GameObject extends Object {
        _body: Matter.Body;
        transform: Transform;
        spriteRenderer: SpriteRenderer;
        rigidBody: RigidBody;
        monoBehaviours: List<MonoBehaviour>;
        _components: List<Component>;
        private _engine;
        readonly engine: Engine;
        private _scene;
        readonly scene: Scene;
        readonly isPrefab: boolean;
        readonly isInstance: boolean;
        constructor(scene: Scene);
        constructor(engine: Engine);
        destroy(): void;
        destroyImmediate(): void;
        instantiate(a?: Transform | Vector2, b?: boolean | number, parent?: Transform): Object;
        AddComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T;
        GetComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T;
        GetComponents<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T[];
        _onCollisionEnter(collision: Collision): void;
        _onCollisionStay(collision: Collision): void;
        _onCollisionExit(collision: Collision): void;
    }
}
declare module Alviss {
    class Input {
        engine: Engine;
        constructor(engine: Engine);
        getKey(name: string): boolean;
        getKeyDown(name: string): boolean;
        getKeyUp(name: string): boolean;
        getPadButton(padButton: PadButton): boolean;
        getPadButtonDown(padButton: PadButton): boolean;
        getPadButtonUp(padButton: PadButton): boolean;
    }
}
declare module Alviss {
    class KeyBoard {
        engine: Engine;
        keyDowned: List<string>;
        keyPressed: List<string>;
        keyUped: List<string>;
        constructor(engine: Engine);
        destroy(): void;
        clearKeyPressed(): void;
        private _keyDown;
        private _keyUp;
    }
}
declare module Alviss {
    enum PadButton {
        Up = 0,
        Down = 1,
        Left = 2,
        Right = 3,
        A = 4,
        B = 5,
        X = 6,
        Y = 7,
    }
    class Pad {
        engine: Engine;
        static PadButtonToKey(padButton: PadButton): string;
        padDowned: List<PadButton>;
        padPressed: List<PadButton>;
        padUped: List<PadButton>;
        constructor(engine: Engine);
        destroy(): void;
        clearPadPressed(): void;
        setPadDow(padButton: PadButton): void;
        setPadUp(padButton: PadButton): void;
    }
}
declare module Alviss {
    class Scene {
        engine: Engine;
        private physicEngine;
        readonly physicWorld: Matter.World;
        objects: List<GameObject>;
        bin: List<Object>;
        cameras: List<Camera>;
        colliders: List<Collider>;
        rigidBodies: List<RigidBody>;
        constructor(engine: Engine);
        destroy(): void;
        updatePhysic(): void;
        update(): void;
        render(): void;
    }
}
declare module Alviss {
    class Sprite {
        private _src;
        private _data;
        image: HTMLImageElement;
        constructor();
        constructor(src: string);
        constructor(data: ImageData);
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare namespace Alviss {
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        private static _tmp;
        static Tmp(x: number, y: number): Vector2;
        static Zero(): Vector2;
        static DistanceSquared(a: Vector2, b: Vector2): number;
        static Distance(a: Vector2, b: Vector2): number;
        static Dot(a: Vector2, b: Vector2): number;
        copyFrom(other: Vector2): Vector2;
        clone(): Vector2;
        add(other: Vector2): Vector2;
        add(x: number, y: number): Vector2;
        addInPlace(other: Vector2): Vector2;
        addInPlace(x: number, y: number): Vector2;
        subtract(other: Vector2): Vector2;
        subtract(x: number, y: number): Vector2;
        subtractInPlace(other: Vector2): Vector2;
        subtractInPlace(x: number, y: number): Vector2;
        scale(s: number): Vector2;
        scaleInPlace(s: number): Vector2;
        multiply(other: Vector2): Vector2;
        multiply(x: number, y: number): Vector2;
        multiplyInPlace(other: Vector2): Vector2;
        multiplyInPlace(x: number, y: number): Vector2;
        normalize(): Vector2;
        normalizeInPlace(): Vector2;
        clampX(minX: number, maxX: number): Vector2;
        clampXInPlace(minX: number, maxX: number): Vector2;
        clampY(minY: number, maxY: number): Vector2;
        clampYInPlace(minY: number, maxY: number): Vector2;
        mirror(n: Vector2): Vector2;
        mirrorInPlace(n: Vector2): Vector2;
        rotate(a: number): Vector2;
        rotateInPlace(a: number): Vector2;
        lengthSquared(): number;
        length(): number;
    }
}
declare module Alviss {
    class Camera extends Component {
        width: number;
        height: number;
        constructor(gameObject: GameObject);
        destroyImmediate(): void;
        serialize(): any;
        deserialize(data: any): void;
    }
}
declare module Alviss {
    class Collider extends Component {
        constructor(gameObject: GameObject);
        destroyImmediate(): void;
        intersects(other: Collider): Collision;
        private _createBody();
        private _lastCollisions;
        collisions: List<Collision>;
        _update(): void;
    }
}
declare module Alviss {
    class DiscCollider extends Collider {
        radius: number;
        constructor(gameObject: GameObject);
        serialize(): any;
        deserialize(data: any): void;
        intersects(other: Collider): Collision;
        private intersectsDisc(other);
        private _tmpProject;
        private intersectsSquare(other);
    }
}
declare module Alviss {
    abstract class MonoBehaviour extends Component {
        readonly scene: Scene;
        readonly engine: Engine;
        constructor(gameObject: GameObject);
        destroyImmediate(): void;
        private _started;
        Start(): void;
        _update(): void;
        Update(): void;
        _fixedUpdate(): void;
        FixedUpdate(): void;
        OnCollisionEnter(collision: Collision): void;
        OnCollisionStay(collision: Collision): void;
        OnCollisionExit(collision: Collision): void;
    }
}
declare module Alviss {
    class RigidBody extends Component {
        collider: Collider;
        private _mass;
        mass: number;
        constructor(gameObject: GameObject);
        destroyImmediate(): void;
        private _createBody();
        _update(): void;
        AddForce(force: Vector2): void;
    }
}
declare module Alviss {
    class SpriteRenderer extends Component {
        sprite: Sprite;
        constructor(gameObject: GameObject);
        destroyImmediate(): void;
        serialize(): any;
        deserialize(data: any): void;
        private _screenPosition;
        _render(camera?: Camera): void;
    }
}
declare module Alviss {
    class RectangleCollider extends Collider {
        width: number;
        height: number;
        readonly x0: number;
        readonly x1: number;
        readonly y0: number;
        readonly y1: number;
        constructor(gameObject: GameObject);
        serialize(): any;
        deserialize(data: any): void;
        intersects(other: Collider): Collision;
        private _tmpProject;
        private intersectsDisc(other);
        private intersectsSquare(other);
    }
}
declare module Alviss {
    class Transform extends Component {
        private _worldPositionIsDirty;
        private _worldPosition;
        getWorldPosition(): Vector2;
        setWorldPosition(p: Vector2): void;
        setWorldPosition(x: number, y: number): void;
        private _localPosition;
        getLocalPosition(): Vector2;
        setLocalPosition(p: Vector2): void;
        setLocalPosition(x: number, y: number): void;
        private _localAngle;
        localAngle: number;
        worldAngle: number;
        depth: number;
        private _parent;
        parent: Transform;
        children: List<Transform>;
        flagWorldPosDirty(): void;
        constructor(gameObject: GameObject);
        destroyImmediate(): void;
        serialize(): any;
        deserialize(data: any): void;
        Translate(v: Vector2): void;
        Translate(x: number, y: number): void;
        Rotate(a: number): void;
    }
}
declare namespace Alviss {
    class List<T> {
        array: T[];
        constructor();
        copyFrom(other: List<T>): List<T>;
        clear(): List<T>;
        push(e: T): void;
        push_first(e: T): void;
        remove(e: T): void;
        removeAt(i: number): void;
        pop_first(): T;
        pop_last(): T;
        first(predicate: (e: T) => boolean): T;
        indexOf(e: T): number;
        contains(e: T): boolean;
        sort(compareFn: (a: T, b: T) => number): void;
        forEach(func: (a: T, i: number) => void): void;
        get(i: number): T;
        head(): T;
        tail(): T;
        readonly length: number;
    }
}
declare namespace Alviss {
    class SpriteTools {
        static CreateSquareSprite(size: number, red?: number, green?: number, blue?: number, alpha?: number): Sprite;
        static CreateRectangleSprite(width: number, height: number, red?: number, green?: number, blue?: number, alpha?: number): Sprite;
        static CreateDiscSprite(radius: number, red?: number, green?: number, blue?: number, alpha?: number): Sprite;
        static CreateSprite(ascii: string, red?: number, green?: number, blue?: number, alpha?: number): Sprite;
    }
}
