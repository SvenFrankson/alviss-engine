var Alviss;
(function (Alviss) {
    class Component {
        constructor(gameObject) {
            this.gameObject = gameObject;
        }
        get scene() {
            return this.gameObject.scene;
        }
        get transform() {
            return this.gameObject.transform;
        }
        GetComponent(TConstructor) {
            return this.gameObject.GetComponent(TConstructor);
        }
        GetComponents(TConstructor) {
            return this.gameObject.GetComponents(TConstructor);
        }
    }
    Alviss.Component = Component;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Engine {
        constructor(context, width, height) {
            this.context = context;
            this.width = width;
            this.height = height;
            this.scenes = new Alviss.List();
            this.keyboard = new Alviss.KeyBoard(this);
            this.pad = new Alviss.Pad(this);
            this.input = new Alviss.Input(this);
            setInterval(() => {
                this.scenes.forEach((scene) => {
                    scene.update();
                });
                this.context.clearRect(0, 0, this.width, this.height);
                this.scenes.forEach((scene) => {
                    scene.render();
                });
                this.keyboard.clearKeyPressed();
                this.pad.clearPadPressed();
            }, 15);
        }
    }
    Alviss.Engine = Engine;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class GameObject {
        constructor(scene) {
            this.scene = scene;
            this.monoBehaviours = new Alviss.List();
            this._components = new Alviss.List();
            this.scene.objects.push(this);
            this.AddComponent(Alviss.Transform);
        }
        destroy() {
            this.scene.objects.remove(this);
        }
        AddComponent(TConstructor) {
            let component = this.GetComponent(TConstructor);
            if (!component) {
                component = new TConstructor(this);
                this._components.push(component);
                if (component instanceof Alviss.MonoBehaviour) {
                    this.monoBehaviours.push(component);
                }
                if (component instanceof Alviss.Transform) {
                    this.transform = component;
                }
                if (component instanceof Alviss.SpriteRenderer) {
                    this.spriteRenderer = component;
                }
            }
            return component;
        }
        GetComponent(TConstructor) {
            return this._components.first((c) => { return c instanceof TConstructor; });
        }
        GetComponents(TConstructor) {
            let components = [];
            for (let i = 0; i < this._components.length; i++) {
                let component = this._components.get(i);
                if (component instanceof TConstructor) {
                    components.push(component);
                }
            }
            return components;
        }
    }
    Alviss.GameObject = GameObject;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Input {
        constructor(engine) {
            this.engine = engine;
        }
        getKey(name) {
            return this.engine.keyboard.keyPressed.contains(name);
        }
        getKeyDown(name) {
            return this.engine.keyboard.keyDowned.contains(name);
        }
        getKeyUp(name) {
            return this.engine.keyboard.keyUped.contains(name);
        }
        getPadButton(padButton) {
            if (this.getKey(Alviss.Pad.PadButtonToKey(padButton))) {
                return true;
            }
        }
        getPadButtonDown(padButton) {
            if (this.getKeyDown(Alviss.Pad.PadButtonToKey(padButton))) {
                return true;
            }
        }
        getPadButtonUp(padButton) {
            if (this.getKeyUp(Alviss.Pad.PadButtonToKey(padButton))) {
                return true;
            }
        }
    }
    Alviss.Input = Input;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class KeyBoard {
        constructor(engine) {
            this.engine = engine;
            this.keyDowned = new Alviss.List();
            this.keyPressed = new Alviss.List();
            this.keyUped = new Alviss.List();
            this._keyDown = (event) => {
                this.keyDowned.push(event.key);
                this.keyPressed.push(event.key);
            };
            this._keyUp = (event) => {
                this.keyUped.push(event.key);
                this.keyDowned.remove(event.key);
            };
            window.addEventListener("keydown", this._keyDown);
            window.addEventListener("keyup", this._keyUp);
        }
        destroy() {
            window.removeEventListener("keydown", this._keyDown);
            window.removeEventListener("keyup", this._keyUp);
        }
        clearKeyPressed() {
            while (this.keyPressed.length > 0) {
                this.keyPressed.removeAt(0);
            }
        }
    }
    Alviss.KeyBoard = KeyBoard;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class MonoBehaviour extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
            this._started = false;
            gameObject.monoBehaviours.push(this);
        }
        get scene() {
            return this.gameObject.scene;
        }
        get engine() {
            return this.scene.engine;
        }
        destroy() {
            this.gameObject.monoBehaviours.remove(this);
        }
        start() { }
        ;
        update() {
            if (!this._started) {
                this.start();
                this._started = true;
            }
        }
        ;
    }
    Alviss.MonoBehaviour = MonoBehaviour;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    let PadButton;
    (function (PadButton) {
        PadButton[PadButton["Up"] = 0] = "Up";
        PadButton[PadButton["Down"] = 1] = "Down";
        PadButton[PadButton["Left"] = 2] = "Left";
        PadButton[PadButton["Right"] = 3] = "Right";
        PadButton[PadButton["A"] = 4] = "A";
        PadButton[PadButton["B"] = 5] = "B";
        PadButton[PadButton["X"] = 6] = "X";
        PadButton[PadButton["Y"] = 7] = "Y";
    })(PadButton = Alviss.PadButton || (Alviss.PadButton = {}));
    class Pad {
        constructor(engine) {
            this.engine = engine;
            this.padDowned = new Alviss.List();
            this.padPressed = new Alviss.List();
            this.padUped = new Alviss.List();
        }
        static PadButtonToKey(padButton) {
            if (padButton === PadButton.Up) {
                return "ArrowUp";
            }
            if (padButton === PadButton.Down) {
                return "ArrowDown";
            }
            if (padButton === PadButton.Left) {
                return "ArrowLeft";
            }
            if (padButton === PadButton.Right) {
                return "ArrowRight";
            }
        }
        destroy() {
        }
        clearPadPressed() {
            while (this.padPressed.length > 0) {
                this.padPressed.removeAt(0);
            }
        }
        setPadDow(padButton) {
            this.padDowned.push(padButton);
            this.padPressed.push(padButton);
        }
        setPadUp(padButton) {
            this.padUped.push(padButton);
            this.padDowned.remove(padButton);
        }
    }
    Alviss.Pad = Pad;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Scene {
        constructor(engine) {
            this.engine = engine;
            this.objects = new Alviss.List();
            this.engine.scenes.push(this);
        }
        destroy() {
            this.engine.scenes.remove(this);
        }
        update() {
            this.objects.forEach((g) => {
                g.monoBehaviours.forEach((m) => {
                    m.update();
                });
            });
        }
        render() {
            this.objects.sort((g1, g2) => { return g1.transform.depth - g2.transform.depth; });
            this.objects.forEach((g) => {
                if (g.spriteRenderer) {
                    this.engine.context.putImageData(g.spriteRenderer.sprite.data, g.transform.position.x, this.engine.height - g.transform.position.y);
                }
            });
        }
    }
    Alviss.Scene = Scene;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Sprite {
        constructor(data) {
            this.data = data;
        }
    }
    Alviss.Sprite = Sprite;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class SpriteRenderer extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
        }
    }
    Alviss.SpriteRenderer = SpriteRenderer;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Transform extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
            this.depth = 0;
            this.name = "Transform";
            this.position = Alviss.Vector2.Zero();
        }
        get dx() {
            return Math.round(this.position.x);
        }
        get dy() {
            return Math.round(this.position.y);
        }
    }
    Alviss.Transform = Transform;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Vector2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        static Zero() {
            return new Vector2(0, 0);
        }
    }
    Alviss.Vector2 = Vector2;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class List {
        constructor() {
            this.array = [];
        }
        push(e) {
            if (this.array.indexOf(e) === -1) {
                this.array.push(e);
            }
        }
        push_first(e) {
            if (this.array.indexOf(e) === -1) {
                this.array.splice(0, 0, e);
            }
        }
        remove(e) {
            let i = this.array.indexOf(e);
            if (i >= 0) {
                this.array.splice(i, 1);
            }
        }
        removeAt(i) {
            this.array.splice(i, 1);
        }
        pop_first() {
            if (this.length > 0) {
                let e = this.get(0);
                this.removeAt(0);
                return e;
            }
        }
        pop_last() {
            return this.array.pop();
        }
        first(predicate) {
            for (let i = 0; i < this.array.length; i++) {
                if (predicate(this.array[i])) {
                    return this.array[i];
                }
            }
            return undefined;
        }
        indexOf(e) {
            return this.array.indexOf(e);
        }
        contains(e) {
            return this.indexOf(e) !== -1;
        }
        sort(compareFn) {
            this.array.sort(compareFn);
        }
        forEach(func) {
            this.array.forEach(func);
        }
        get(i) {
            return this.array[i];
        }
        head() {
            return this.array[0];
        }
        tail() {
            return this.array[this.array.length - 1];
        }
        get length() {
            return this.array.length;
        }
    }
    Alviss.List = List;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class SpriteTools {
        static CreateSquareSprite(size, red = 1, green = 1, blue = 1, alpha = 1) {
            let buffer = new Uint8ClampedArray(size * size * 4);
            for (let j = 0; j < size; j++) {
                for (let i = 0; i < size; i++) {
                    let index = i + j * size;
                    buffer[index * 4] = red;
                    buffer[index * 4 + 1] = green;
                    buffer[index * 4 + 2] = blue;
                    buffer[index * 4 + 3] = alpha;
                }
            }
            return new ImageData(buffer, size, size);
        }
        static CreateSprite(ascii, red = 1, green = 1, blue = 1, alpha = 1) {
            ascii = ascii.trim();
            while (ascii.indexOf(" ") !== -1) {
                ascii = ascii.replace(" ", "");
            }
            let lines = ascii.split("\n");
            let height = lines.length;
            let width = lines[0].length;
            for (let i = 1; i < lines.length; i++) {
                width = Math.max(width, lines[i].length);
            }
            let buffer = new Uint8ClampedArray(width * height * 4);
            for (let j = 0; j < height; j++) {
                for (let i = 0; i < width; i++) {
                    let index = i + j * width;
                    let v = 0;
                    let c = lines[j][i];
                    if (c) {
                        let n = parseInt(c);
                        if (n > 0 && n < 9) {
                            v = n / 8;
                        }
                    }
                    buffer[index * 4] = red * v;
                    buffer[index * 4 + 1] = green * v;
                    buffer[index * 4 + 2] = blue * v;
                    buffer[index * 4 + 3] = v === 0 ? 0 : alpha;
                }
            }
            return new Alviss.Sprite(new ImageData(buffer, width, height));
        }
    }
    Alviss.SpriteTools = SpriteTools;
})(Alviss || (Alviss = {}));
