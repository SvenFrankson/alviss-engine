declare module Alviss {
    class Collision {
        collider: Collider;
        contact: Vector2;
        readonly gameObject: GameObject;
        constructor(collider: Collider);
    }
}
declare module Alviss {
    class Component {
        name: string;
        gameObject: GameObject;
        readonly scene: Scene;
        readonly engine: Engine;
        readonly transform: Transform;
        constructor(gameObject: GameObject);
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
    class GameObject {
        scene: Scene;
        transform: Transform;
        spriteRenderer: SpriteRenderer;
        monoBehaviours: List<MonoBehaviour>;
        private _components;
        readonly engine: Engine;
        constructor(scene: Scene);
        destroy(): void;
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
        data: ImageData;
        image: HTMLImageElement;
        constructor(data: ImageData);
    }
}
declare namespace Alviss {
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        static Zero(): Vector2;
        static DistanceSquared(a: Vector2, b: Vector2): number;
        static Distance(a: Vector2, b: Vector2): number;
        static Dot(a: Vector2, b: Vector2): number;
        copyFrom(other: Vector2): Vector2;
        clone(): Vector2;
        add(other: Vector2): Vector2;
        addInPlace(other: Vector2): Vector2;
        subtract(other: Vector2): Vector2;
        subtractInPlace(other: Vector2): Vector2;
        scale(s: number): Vector2;
        scaleInPlace(s: number): Vector2;
        normalize(): Vector2;
        normalizeInPlace(): Vector2;
        clampX(minX: number, maxX: number): Vector2;
        clampXInPlace(minX: number, maxX: number): Vector2;
        clampY(minY: number, maxY: number): Vector2;
        clampYInPlace(minY: number, maxY: number): Vector2;
        mirror(n: Vector2): Vector2;
        mirrorInPlace(n: Vector2): Vector2;
        lengthSquared(): number;
        length(): number;
    }
}
declare module Alviss {
    class Collider extends Component {
        localPosition: Vector2;
        private _worldPosition;
        worldPosition: Vector2;
        constructor(gameObject: GameObject);
        destroy(): void;
        intersects(other: Collider): Collision;
        private _lastCollisions;
        collisions: List<Collision>;
        _update(): void;
    }
}
declare module Alviss {
    class DiscCollider extends Collider {
        radius: number;
        constructor(gameObject: GameObject);
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
        destroy(): void;
        private _started;
        Start(): void;
        _update(): void;
        Update(): void;
        OnCollisionEnter(collision: Collision): void;
        OnCollisionStay(collision: Collision): void;
        OnCollisionExit(collision: Collision): void;
    }
}
declare module Alviss {
    class RigidBody extends Component {
        private _body;
        collider: Collider;
        constructor(gameObject: GameObject);
        destroy(): void;
        private _createBody();
        _update(): void;
    }
}
declare module Alviss {
    class SpriteRenderer extends Component {
        sprite: Sprite;
        constructor(gameObject: GameObject);
    }
}
declare module Alviss {
    class SquareCollider extends Collider {
        size: number;
        readonly x0: number;
        readonly x1: number;
        readonly y0: number;
        readonly y1: number;
        constructor(gameObject: GameObject);
        intersects(other: Collider): Collision;
        private _tmpProject;
        private intersectsDisc(other);
        private intersectsSquare(other);
    }
}
declare module Alviss {
    class Transform extends Component {
        position: Vector2;
        readonly dx: number;
        readonly dy: number;
        depth: number;
        constructor(gameObject: GameObject);
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
        static CreateDiscSprite(radius: number, red?: number, green?: number, blue?: number, alpha?: number): Sprite;
        static CreateSprite(ascii: string, red?: number, green?: number, blue?: number, alpha?: number): Sprite;
    }
}
