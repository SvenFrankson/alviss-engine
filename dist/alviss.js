var Alviss;
(function (Alviss) {
    class Collision {
        constructor(collider) {
            this.collider = collider;
        }
        get gameObject() {
            return this.collider.gameObject;
        }
    }
    Alviss.Collision = Collision;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Component {
        constructor(gameObject) {
            this.gameObject = gameObject;
        }
        get scene() {
            return this.gameObject.scene;
        }
        get engine() {
            return this.gameObject.engine;
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
                    scene.updatePhysic();
                });
                this.scenes.forEach((scene) => {
                    scene.update();
                });
                this.context.fillStyle = "black";
                this.context.fillRect(0, 0, this.width, this.height);
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
            this.AddComponent(Alviss.Transform);
            this.scene.objects.push(this);
        }
        get engine() {
            return this.scene.engine;
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
        _onCollisionEnter(collision) {
            this.monoBehaviours.forEach((m) => {
                m.OnCollisionEnter(collision);
            });
        }
        _onCollisionStay(collision) {
            this.monoBehaviours.forEach((m) => {
                m.OnCollisionStay(collision);
            });
        }
        _onCollisionExit(collision) {
            this.monoBehaviours.forEach((m) => {
                m.OnCollisionExit(collision);
            });
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
            this.colliders = new Alviss.List();
            this.rigidBodies = new Alviss.List();
            this.engine.scenes.push(this);
            this.physicEngine = Matter.Engine.create();
            this.physicWorld.gravity.y = -1;
        }
        get physicWorld() {
            return this.physicEngine.world;
        }
        destroy() {
            this.engine.scenes.remove(this);
        }
        updatePhysic() {
            Matter.Engine.update(this.physicEngine, 1000 / 60);
            this.rigidBodies.forEach((r) => {
                r._update();
            });
        }
        update() {
            this.colliders.forEach((c) => {
                this.colliders.forEach((other) => {
                    if (c !== other) {
                        let collision = c.intersects(other);
                        if (collision) {
                            c.collisions.push(collision);
                        }
                    }
                });
            });
            this.colliders.forEach((c) => {
                c._update();
            });
            this.objects.forEach((g) => {
                g.monoBehaviours.forEach((m) => {
                    m._update();
                });
            });
        }
        render() {
            this.objects.sort((g1, g2) => { return g1.transform.depth - g2.transform.depth; });
            this.objects.forEach((g) => {
                if (g.spriteRenderer) {
                    this.engine.context.drawImage(g.spriteRenderer.sprite.image, Math.round(g.transform.position.x - g.spriteRenderer.sprite.image.width * 0.5), Math.round(this.engine.height - (g.transform.position.y + g.spriteRenderer.sprite.image.height * 0.5)));
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
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = data.width;
            canvas.height = data.height;
            ctx.putImageData(data, 0, 0);
            this.image = document.createElement("img");
            this.image.src = canvas.toDataURL();
        }
    }
    Alviss.Sprite = Sprite;
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
        static DistanceSquared(a, b) {
            return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
        }
        static Distance(a, b) {
            return Math.sqrt(Vector2.DistanceSquared(a, b));
        }
        static Dot(a, b) {
            return a.x * b.x + a.y * b.y;
        }
        copyFrom(other) {
            this.x = other.x;
            this.y = other.y;
            return this;
        }
        clone() {
            return new Vector2(this.x, this.y);
        }
        add(other) {
            return new Vector2(this.x + other.x, this.y + other.y);
        }
        addInPlace(other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        }
        subtract(other) {
            return new Vector2(this.x - other.x, this.y - other.y);
        }
        subtractInPlace(other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        }
        scale(s) {
            return new Vector2(this.x * s, this.y * s);
        }
        scaleInPlace(s) {
            this.x *= s;
            this.y *= s;
            return this;
        }
        normalize() {
            let l = this.length();
            return new Vector2(this.x / l, this.y / l);
        }
        normalizeInPlace() {
            let l = this.length();
            this.x /= l;
            this.y /= l;
            return this;
        }
        clampX(minX, maxX) {
            return new Vector2(Math.max(Math.min(this.x, maxX), minX), this.y);
        }
        clampXInPlace(minX, maxX) {
            this.x = Math.max(Math.min(this.x, maxX), minX);
            return this;
        }
        clampY(minY, maxY) {
            return new Vector2(this.y, Math.max(Math.min(this.y, maxY), minY));
        }
        clampYInPlace(minY, maxY) {
            this.y = Math.max(Math.min(this.y, maxY), minY);
            return this;
        }
        mirror(n) {
            n = n.normalize();
            let proj = Vector2.Dot(this, n);
            return n.clone().scaleInPlace(-2 * proj).addInPlace(this);
        }
        mirrorInPlace(n) {
            n = n.normalize();
            let proj = Vector2.Dot(this, n);
            this.subtractInPlace(n.clone().scaleInPlace(2 * proj));
            return this;
        }
        lengthSquared() {
            return this.x * this.x + this.y * this.y;
        }
        length() {
            return Math.sqrt(this.lengthSquared());
        }
    }
    Alviss.Vector2 = Vector2;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Collider extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
            this.localPosition = Alviss.Vector2.Zero();
            this._worldPosition = Alviss.Vector2.Zero();
            this._lastCollisions = new Alviss.List();
            this.collisions = new Alviss.List();
            this.name = "Collider";
            this.localPosition = Alviss.Vector2.Zero();
            this.scene.colliders.push(this);
        }
        get worldPosition() {
            this._worldPosition.copyFrom(this.gameObject.transform.position).addInPlace(this.localPosition);
            return this._worldPosition;
        }
        set worldPosition(p) {
            this.localPosition.copyFrom(p).subtractInPlace(this.gameObject.transform.position);
        }
        destroy() {
            this.scene.colliders.remove(this);
        }
        intersects(other) {
            return undefined;
        }
        _update() {
            this.collisions.forEach((collision) => {
                if (this._lastCollisions.first((lastCollision) => { return collision.collider === lastCollision.collider; })) {
                    this.gameObject._onCollisionStay(collision);
                }
                else {
                    this.gameObject._onCollisionEnter(collision);
                }
            });
            this._lastCollisions.forEach((lastCollision) => {
                if (!(this.collisions.first((collision) => { return lastCollision.collider === collision.collider; }))) {
                    this.gameObject._onCollisionExit(lastCollision);
                }
            });
            this._lastCollisions.copyFrom(this.collisions);
            this.collisions.clear();
        }
    }
    Alviss.Collider = Collider;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class DiscCollider extends Alviss.Collider {
        constructor(gameObject) {
            super(gameObject);
            this._tmpProject = Alviss.Vector2.Zero();
            this.name = "DiscCollider";
            this.radius = 8;
        }
        intersects(other) {
            if (other instanceof DiscCollider) {
                return this.intersectsDisc(other);
            }
            if (other instanceof Alviss.SquareCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }
        intersectsDisc(other) {
            let radiusSumSquared = this.radius * this.radius + other.radius * other.radius;
            if (Alviss.Vector2.DistanceSquared(this.worldPosition, other.worldPosition) < radiusSumSquared) {
                let collision = new Alviss.Collision(other);
                collision.contact = this.worldPosition.subtract(other.worldPosition);
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.worldPosition);
                return collision;
            }
            return undefined;
        }
        intersectsSquare(other) {
            this._tmpProject.copyFrom(this.worldPosition);
            this._tmpProject.clampXInPlace(other.x0, other.x1);
            this._tmpProject.clampYInPlace(other.y0, other.y1);
            if (Alviss.Vector2.DistanceSquared(this.worldPosition, this._tmpProject) < this.radius * this.radius) {
                let collision = new Alviss.Collision(other);
                collision.contact = this._tmpProject.clone();
            }
            return undefined;
        }
    }
    Alviss.DiscCollider = DiscCollider;
})(Alviss || (Alviss = {}));
/// <reference path="../Component.ts"/>
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
        Start() { }
        ;
        _update() {
            if (!this._started) {
                this.Start();
                this._started = true;
            }
            else {
                this.Update();
            }
        }
        Update() { }
        ;
        OnCollisionEnter(collision) { }
        ;
        OnCollisionStay(collision) { }
        ;
        OnCollisionExit(collision) { }
        ;
    }
    Alviss.MonoBehaviour = MonoBehaviour;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class RigidBody extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
            this.collider = this.GetComponent(Alviss.Collider);
            this.scene.rigidBodies.push(this);
        }
        destroy() {
            this.scene.rigidBodies.remove(this);
        }
        _createBody() {
            if (this.collider instanceof Alviss.DiscCollider) {
                this._body = Matter.Bodies.circle(this.transform.position.x, this.transform.position.y, this.collider.radius);
                Matter.World.add(this.scene.physicWorld, [this._body]);
            }
        }
        _update() {
            if (!this._body) {
                this._createBody();
            }
            if (this._body) {
                this.transform.position.x = this._body.position.x;
                this.transform.position.y = this._body.position.y;
            }
        }
    }
    Alviss.RigidBody = RigidBody;
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
    class SquareCollider extends Alviss.Collider {
        constructor(gameObject) {
            super(gameObject);
            this._tmpProject = Alviss.Vector2.Zero();
            this.name = "SquareCollider";
            this.size = 8;
        }
        get x0() {
            return this.worldPosition.x - this.size * 0.5;
        }
        get x1() {
            return this.worldPosition.x + this.size * 0.5;
        }
        get y0() {
            return this.worldPosition.y - this.size * 0.5;
        }
        get y1() {
            return this.worldPosition.y + this.size * 0.5;
        }
        intersects(other) {
            if (other instanceof Alviss.DiscCollider) {
                return this.intersectsDisc(other);
            }
            else if (other instanceof SquareCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }
        intersectsDisc(other) {
            this._tmpProject.copyFrom(other.worldPosition);
            this._tmpProject.clampXInPlace(this.x0, this.x1);
            this._tmpProject.clampYInPlace(this.y0, this.y1);
            if (Alviss.Vector2.DistanceSquared(other.worldPosition, this._tmpProject) < other.radius * other.radius) {
                let collision = new Alviss.Collision(other);
                collision.contact = this._tmpProject.subtract(other.worldPosition);
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.worldPosition);
            }
            return undefined;
        }
        intersectsSquare(other) {
            if (this.x1 < other.x0 || this.x0 > other.x1 || this.y1 < other.y0 || this.y0 > other.y1) {
                return undefined;
            }
            let collision = new Alviss.Collision(other);
            collision.contact = this.worldPosition.clone();
            collision.contact.clampXInPlace(other.x0, other.x1);
            collision.contact.clampYInPlace(other.y0, other.y1);
            return collision;
        }
    }
    Alviss.SquareCollider = SquareCollider;
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
    class List {
        constructor() {
            this.array = [];
        }
        copyFrom(other) {
            this.array = other.array.slice();
            return this;
        }
        clear() {
            this.array = [];
            return this;
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
            return new Alviss.Sprite(new ImageData(buffer, size, size));
        }
        static CreateDiscSprite(radius, red = 1, green = 1, blue = 1, alpha = 1) {
            let buffer = new Uint8ClampedArray(2 * radius * 2 * radius * 4);
            let radiusSquared = (radius) * (radius);
            for (let j = 0; j < 2 * radius; j++) {
                for (let i = 0; i < 2 * radius; i++) {
                    let index = i + j * 2 * radius;
                    if ((i - radius) * (i - radius) + (j - radius) * (j - radius) < radiusSquared) {
                        buffer[index * 4] = red;
                        buffer[index * 4 + 1] = green;
                        buffer[index * 4 + 2] = blue;
                        buffer[index * 4 + 3] = alpha;
                    }
                    else {
                        buffer[index * 4] = 0;
                        buffer[index * 4 + 1] = 0;
                        buffer[index * 4 + 2] = 0;
                        buffer[index * 4 + 3] = 0;
                    }
                }
            }
            return new Alviss.Sprite(new ImageData(buffer, 2 * radius, 2 * radius));
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
