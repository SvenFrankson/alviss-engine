declare module Alviss {
    class Component {
        name: string;
        gameObject: GameObject;
        readonly scene: Scene;
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
        constructor(scene: Scene);
        destroy(): void;
        AddComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T;
        GetComponent<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T;
        GetComponents<T extends Component>(TConstructor: new (gameObject: GameObject) => T): T[];
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
    abstract class MonoBehaviour extends Component {
        readonly scene: Scene;
        readonly engine: Engine;
        constructor(gameObject: GameObject);
        destroy(): void;
        private _started;
        start(): void;
        update(): void;
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
        objects: List<GameObject>;
        constructor(engine: Engine);
        destroy(): void;
        update(): void;
        render(): void;
    }
}
declare module Alviss {
    class Sprite {
        data: ImageData;
        constructor(data: ImageData);
    }
}
declare module Alviss {
    class SpriteRenderer extends Component {
        sprite: Sprite;
        constructor(gameObject: GameObject);
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
declare module Alviss {
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        static Zero(): Vector2;
    }
}
declare module Alviss {
    class List<T> {
        array: T[];
        constructor();
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
declare module Alviss {
    class SpriteTools {
        static CreateSquareSprite(size: number, red?: number, green?: number, blue?: number, alpha?: number): ImageData;
        static CreateSprite(ascii: string, red?: number, green?: number, blue?: number, alpha?: number): Sprite;
    }
}
