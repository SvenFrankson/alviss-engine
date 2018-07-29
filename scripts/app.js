class Engine {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
        this.scenes = new List();
        this.keyboard = new KeyBoard(this);
        this.pad = new Pad(this);
        this.input = new Input(this);
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
class GameObject {
    constructor(scene) {
        this.scene = scene;
        this.depth = 0;
        this._currentSpriteIndex = -1;
        this._sprites = [];
        this.monoBehaviours = new List();
        this.position = Vector2.Zero();
        this.scene.objects.push(this);
    }
    get dx() {
        return Math.round(this.position.x - this.currentSprite.width / 2);
    }
    get dy() {
        return Math.round(this.position.y - this.currentSprite.height / 2);
    }
    get currentSprite() {
        return this._sprites[this._currentSpriteIndex];
    }
    destroy() {
        this.scene.objects.remove(this);
    }
    addSprite(sprite) {
        this._sprites.push(sprite);
        this._currentSpriteIndex = this._sprites.length - 1;
    }
}
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
        if (this.getKey(Pad.PadButtonToKey(padButton))) {
            return true;
        }
    }
    getPadButtonDown(padButton) {
        if (this.getKeyDown(Pad.PadButtonToKey(padButton))) {
            return true;
        }
    }
    getPadButtonUp(padButton) {
        if (this.getKeyUp(Pad.PadButtonToKey(padButton))) {
            return true;
        }
    }
}
class KeyBoard {
    constructor(engine) {
        this.engine = engine;
        this.keyDowned = new List();
        this.keyPressed = new List();
        this.keyUped = new List();
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
class MonoBehaviour {
    constructor(gameObject) {
        this.gameObject = gameObject;
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
var PadButton;
(function (PadButton) {
    PadButton[PadButton["Up"] = 0] = "Up";
    PadButton[PadButton["Down"] = 1] = "Down";
    PadButton[PadButton["Left"] = 2] = "Left";
    PadButton[PadButton["Right"] = 3] = "Right";
    PadButton[PadButton["A"] = 4] = "A";
    PadButton[PadButton["B"] = 5] = "B";
    PadButton[PadButton["X"] = 6] = "X";
    PadButton[PadButton["Y"] = 7] = "Y";
})(PadButton || (PadButton = {}));
class Pad {
    constructor(engine) {
        this.engine = engine;
        this.padDowned = new List();
        this.padPressed = new List();
        this.padUped = new List();
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
class Scene {
    constructor(engine) {
        this.engine = engine;
        this.objects = new List();
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
        this.objects.sort((g1, g2) => { return g1.depth - g2.depth; });
        this.objects.forEach((g) => {
            this.engine.context.putImageData(g.currentSprite, g.dx, this.engine.height - g.dy);
        });
    }
}
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static Zero() {
        return new Vector2(0, 0);
    }
}
class Snake extends MonoBehaviour {
    constructor() {
        super(...arguments);
        this.direction = new Vector2(1, 0);
        this.parts = new List();
        this.t = 0;
        this.speed = 2;
    }
    start() {
        this.gameObject.addSprite(SpriteTools.CreateSprite(`
                    00111100
                    01222210
                    12333321
                    12344321
                    12344321
                    12333321
                    01222210
                    00111100
                `, 256, 256, 0, 256));
        this.gameObject.position.x = 8 * 4;
        this.gameObject.position.y = 8 * 4;
    }
    update() {
        super.update();
        if (this.engine.input.getPadButton(PadButton.Up)) {
            this.direction.x = 0;
            this.direction.y = 1;
        }
        if (this.engine.input.getPadButton(PadButton.Down)) {
            this.direction.x = 0;
            this.direction.y = -1;
        }
        if (this.engine.input.getPadButton(PadButton.Right)) {
            this.direction.x = 1;
            this.direction.y = 0;
        }
        if (this.engine.input.getPadButton(PadButton.Left)) {
            this.direction.x = -1;
            this.direction.y = 0;
        }
        this.t++;
        if (this.t > 60 / this.speed) {
            this.t = 0;
            let lastX = this.gameObject.position.x;
            let lastY = this.gameObject.position.y;
            this.gameObject.position.x += this.direction.x * 8;
            this.gameObject.position.y += this.direction.y * 8;
            if (Math.random() > 0.9) {
                let newPart = new GameObject(this.scene);
                newPart.addSprite(SpriteTools.CreateSprite(`
                            00111100
                            01222210
                            12333321
                            12344321
                            12344321
                            12333321
                            01222210
                            00111100
                        `, 256, 256, 0, 256));
                newPart.position.x = lastX;
                newPart.position.y = lastY;
                this.parts.push_first(newPart);
                this.speed *= 1;
            }
            else {
                for (let i = this.parts.length - 1; i > 0; i--) {
                    let part = this.parts.get(i);
                    let previousPart = this.parts.get(i - 1);
                    part.position.x = previousPart.position.x;
                    part.position.y = previousPart.position.y;
                }
                let part0 = this.parts.get(0);
                if (part0) {
                    part0.position.x = lastX;
                    part0.position.y = lastY;
                }
            }
        }
    }
}
window.onload = () => {
    let canvas = document.getElementById("render-canvas-snake");
    if (canvas instanceof HTMLCanvasElement) {
        canvas.width = 128;
        canvas.height = 128;
        let context = canvas.getContext("2d");
        let engine = new Engine(context, canvas.width, canvas.height);
        let scene = new Scene(engine);
        let g = new GameObject(scene);
        g.position.x = 25;
        g.position.y = 30;
        new Snake(g);
    }
};
class TestMBH1 extends MonoBehaviour {
    update() {
        super.update();
        if (this.engine.input.getPadButtonDown(PadButton.Up)) {
            this.gameObject.position.y += 1;
        }
        if (this.engine.input.getPadButtonDown(PadButton.Down)) {
            this.gameObject.position.y -= 1;
        }
        if (this.engine.input.getPadButtonDown(PadButton.Right)) {
            this.gameObject.position.x += 1;
        }
        if (this.engine.input.getPadButtonDown(PadButton.Left)) {
            this.gameObject.position.x -= 1;
        }
    }
}
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
    get length() {
        return this.array.length;
    }
}
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
        return new ImageData(buffer, width, height);
    }
}
