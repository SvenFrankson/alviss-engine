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
var Alviss;
(function (Alviss) {
    class Object {
        static _newId() {
            return Object._ids++;
        }
        static Destroy(o) {
            o.destroy();
        }
        static Instantiate(o, a, b, parent) {
            if (!a) {
                return o.instantiate();
            }
            if (a instanceof Alviss.Transform) {
                return o.instantiate(a, b);
            }
            if (a instanceof Alviss.Vector2) {
                return o.instantiate(a, b, parent);
            }
        }
        destroy() { }
        instantiate(a, b, parent) {
            return new Object();
        }
    }
    Object._ids = 0;
    Alviss.Object = Object;
})(Alviss || (Alviss = {}));
/// <reference path="./Object.ts"/>
var Alviss;
(function (Alviss) {
    class Component extends Alviss.Object {
        constructor(gameObject) {
            super();
            this.gameObject = gameObject;
            gameObject._components.push(this);
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
        get isPrefab() {
            return this.gameObject.isPrefab;
        }
        get isInstance() {
            return this.gameObject.isInstance;
        }
        destroy() {
            this.gameObject._components.remove(this);
        }
        instantiate(a, b, parent) {
            return this.gameObject.instantiate(a, b, parent);
        }
        serialize() { }
        deserialize(data) { }
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
    class GameObject extends Alviss.Object {
        constructor(location) {
            super();
            this.monoBehaviours = new Alviss.List();
            this._components = new Alviss.List();
            this.name = "GameObject";
            if (location instanceof Alviss.Scene) {
                this._scene = location;
                this._engine = this._scene.engine;
            }
            else if (location instanceof Alviss.Engine) {
                this.name += " [Prefab]";
                this._engine = location;
            }
            this.AddComponent(Alviss.Transform);
            if (this.isInstance) {
                this.scene.objects.push(this);
            }
        }
        get engine() {
            return this._engine;
        }
        get scene() {
            return this._scene;
        }
        get isPrefab() {
            return this.scene === undefined;
        }
        get isInstance() {
            return this.scene !== undefined;
        }
        destroy() {
            while (this._components.length > 0) {
                this._components.get(0).destroy();
            }
            if (this.isInstance) {
                this.scene.objects.remove(this);
            }
        }
        instantiate(a, b, parent) {
            let clone;
            if (this.isPrefab) {
                clone = new GameObject(this.engine.scenes.get(0));
            }
            if (this.isInstance) {
                clone = new GameObject(this.scene);
            }
            this._components.forEach((c) => {
                let comp = clone.AddComponent(c.constructor);
                if (comp instanceof Alviss.Component) {
                    comp.deserialize(c.serialize());
                }
            });
            if (a instanceof Alviss.Transform) {
                clone.transform.parent = a;
                if (typeof (b) === "boolean") {
                    if (b) {
                        clone.transform.setWorldPosition(0, 0);
                    }
                }
            }
            else if (a instanceof Alviss.Vector2) {
                if (parent instanceof Alviss.Transform) {
                    clone.transform.parent = parent;
                }
                clone.transform.setLocalPosition(a);
                if (typeof (b) === "number") {
                    clone.transform.localAngle = b;
                }
            }
            return clone;
        }
        AddComponent(TConstructor) {
            let component = this.GetComponent(TConstructor);
            if (!component) {
                component = new TConstructor(this);
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
            this.cameras = new Alviss.List();
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
                    g.spriteRenderer._render(this.cameras.get(0));
                }
            });
        }
    }
    Alviss.Scene = Scene;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Sprite {
        constructor(arg) {
            this.image = document.createElement("img");
            if (arg === undefined) {
                return;
            }
            let src = "";
            if (arg instanceof ImageData) {
                this._data = arg;
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = arg.width;
                canvas.height = arg.height;
                ctx.putImageData(arg, 0, 0);
                src = canvas.toDataURL();
            }
            else if (typeof (arg) === "string") {
                this._src = arg;
                src = arg;
            }
            this.image.src = src;
        }
        serialize() {
            if (this._src) {
                return {
                    src: this._src
                };
            }
            if (this._data) {
                return {
                    w: this._data.width,
                    h: this._data.height,
                    data: this._data.data
                };
            }
        }
        deserialize(data) {
            if (data) {
                if (data.src) {
                    this._src = data.src;
                    this.image.src = this._src;
                }
                else if (isFinite(data.w) && isFinite(data.h) && data.data) {
                    this._data = new ImageData(data.data, data.w, data.h);
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = this._data.width;
                    canvas.height = this._data.height;
                    ctx.putImageData(this._data, 0, 0);
                    this.image.src = canvas.toDataURL();
                }
            }
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
        static Tmp(x, y) {
            Vector2._tmp.x = x;
            Vector2._tmp.y = y;
            return Vector2._tmp;
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
        add(other, y) {
            if (other instanceof Vector2) {
                return new Vector2(this.x + other.x, this.y + other.y);
            }
            else {
                return new Vector2(this.x + other, this.y + (isFinite(y) ? y : 0));
            }
        }
        addInPlace(other, y) {
            if (other instanceof Vector2) {
                this.x += other.x;
                this.y += other.y;
            }
            else {
                this.x += other;
                this.y += isFinite(y) ? y : 0;
            }
            return this;
        }
        subtract(other, y) {
            if (other instanceof Vector2) {
                return new Vector2(this.x - other.x, this.y - other.y);
            }
            else {
                return new Vector2(this.x - other, this.y - (isFinite(y) ? y : 0));
            }
        }
        subtractInPlace(other, y) {
            if (other instanceof Vector2) {
                this.x -= other.x;
                this.y -= other.y;
            }
            else {
                this.x -= other;
                this.y -= isFinite(y) ? y : 0;
            }
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
        multiply(other, y) {
            if (other instanceof Vector2) {
                return new Vector2(this.x * other.x, this.y * other.y);
            }
            else {
                return new Vector2(this.x * other, this.y * (isFinite(y) ? y : 0));
            }
        }
        multiplyInPlace(other, y) {
            if (other instanceof Vector2) {
                this.x *= other.x;
                this.y *= other.y;
            }
            else {
                this.x *= other;
                this.y *= isFinite(y) ? y : 0;
            }
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
        rotate(a) {
            let cosa = Math.cos(a);
            let sina = Math.sin(a);
            return new Vector2(this.x * cosa - this.y * sina, this.x * sina + this.y * cosa);
        }
        rotateInPlace(a) {
            let cosa = Math.cos(a);
            let sina = Math.sin(a);
            let x = this.x;
            let y = this.y;
            this.x = x * cosa - y * sina;
            this.y = x * sina + y * cosa;
            return this;
        }
        lengthSquared() {
            return this.x * this.x + this.y * this.y;
        }
        length() {
            return Math.sqrt(this.lengthSquared());
        }
    }
    Vector2._tmp = Vector2.Zero();
    Alviss.Vector2 = Vector2;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Camera extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
            this.width = this.engine.width;
            this.height = this.engine.height;
            if (this.isInstance) {
                this.scene.cameras.push(this);
            }
        }
        destroy() {
            super.destroy();
            if (this.isInstance) {
                this.scene.cameras.remove(this);
            }
        }
        serialize() {
            return {
                w: this.width,
                h: this.height
            };
        }
        deserialize(data) {
            if (data) {
                if (isFinite(data.w)) {
                    this.width = data.w;
                }
                if (isFinite(data.h)) {
                    this.height = data.h;
                }
            }
        }
    }
    Alviss.Camera = Camera;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Collider extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
            this._lastCollisions = new Alviss.List();
            this.collisions = new Alviss.List();
            this.name = "Collider";
            if (this.isInstance) {
                this.scene.colliders.push(this);
            }
        }
        destroy() {
            super.destroy();
            if (this.isInstance) {
                this.scene.colliders.remove(this);
            }
        }
        intersects(other) {
            return undefined;
        }
        _createBody() {
            let worldPosition = this.transform.getWorldPosition();
            if (this instanceof Alviss.DiscCollider) {
                this.gameObject._body = Matter.Bodies.circle(worldPosition.x, worldPosition.y, this.radius, { isStatic: true });
                Matter.Body.setAngle(this.gameObject._body, this.transform.worldAngle);
                Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
            }
            else if (this instanceof Alviss.RectangleCollider) {
                console.log("!");
                this.gameObject._body = Matter.Bodies.rectangle(worldPosition.x, worldPosition.y, this.width, this.height, { isStatic: true });
                Matter.Body.setAngle(this.gameObject._body, this.transform.worldAngle);
                Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
            }
        }
        _update() {
            if (!this.gameObject.rigidBody) {
                if (!this.gameObject._body) {
                    this._createBody();
                }
                else {
                    Matter.Body.setPosition(this.gameObject._body, this.transform.getWorldPosition());
                }
            }
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
            if (this.gameObject.spriteRenderer) {
                if (this.gameObject.spriteRenderer.sprite) {
                    if (this.gameObject.spriteRenderer.sprite.image) {
                        if (this.gameObject.spriteRenderer.sprite.image.width > 0) {
                            this.radius = this.gameObject.spriteRenderer.sprite.image.width * 0.5;
                        }
                    }
                }
            }
        }
        serialize() {
            return {
                r: this.radius
            };
        }
        deserialize(data) {
            if (data) {
                if (isFinite(data.r)) {
                    this.radius = data.r;
                }
            }
        }
        intersects(other) {
            if (other instanceof DiscCollider) {
                return this.intersectsDisc(other);
            }
            if (other instanceof Alviss.RectangleCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }
        intersectsDisc(other) {
            let radiusSumSquared = this.radius * this.radius + other.radius * other.radius;
            if (Alviss.Vector2.DistanceSquared(this.transform.getWorldPosition(), other.transform.getWorldPosition()) < radiusSumSquared) {
                let collision = new Alviss.Collision(other);
                collision.contact = this.transform.getWorldPosition().subtract(other.transform.getWorldPosition());
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.transform.getWorldPosition());
                return collision;
            }
            return undefined;
        }
        intersectsSquare(other) {
            this._tmpProject.copyFrom(this.transform.getWorldPosition());
            this._tmpProject.clampXInPlace(other.x0, other.x1);
            this._tmpProject.clampYInPlace(other.y0, other.y1);
            if (Alviss.Vector2.DistanceSquared(this.transform.getWorldPosition(), this._tmpProject) < this.radius * this.radius) {
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
            if (this.isInstance) {
                gameObject.monoBehaviours.push(this);
            }
        }
        get scene() {
            return this.gameObject.scene;
        }
        get engine() {
            return this.scene.engine;
        }
        destroy() {
            super.destroy();
            if (this.isInstance) {
                this.gameObject.monoBehaviours.remove(this);
            }
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
            this._mass = 1;
            gameObject.rigidBody = this;
            this.collider = this.GetComponent(Alviss.Collider);
            if (this.isInstance) {
                this.scene.rigidBodies.push(this);
            }
        }
        get mass() {
            return this._mass;
        }
        set mass(v) {
            this._mass = v;
            if (this.gameObject._body) {
                Matter.Body.setMass(this.gameObject._body, v);
            }
        }
        destroy() {
            super.destroy();
            this.gameObject.rigidBody = undefined;
            if (this.isInstance) {
                this.scene.rigidBodies.remove(this);
            }
        }
        _createBody() {
            if (this.collider) {
                let worldPosition = this.transform.getWorldPosition();
                if (this.collider instanceof Alviss.DiscCollider) {
                    this.gameObject._body = Matter.Bodies.circle(worldPosition.x, worldPosition.y, this.collider.radius);
                    Matter.Body.setAngle(this.gameObject._body, -this.transform.worldAngle);
                    Matter.Body.setMass(this.gameObject._body, this.mass);
                    Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
                }
                else if (this.collider instanceof Alviss.RectangleCollider) {
                    this.gameObject._body = Matter.Bodies.rectangle(worldPosition.x, worldPosition.y, this.collider.width, this.collider.height);
                    Matter.Body.setAngle(this.gameObject._body, -this.transform.worldAngle);
                    Matter.Body.setMass(this.gameObject._body, this.mass);
                    Matter.World.add(this.scene.physicWorld, [this.gameObject._body]);
                }
            }
        }
        _update() {
            if (!this.gameObject._body) {
                this._createBody();
            }
            if (this.gameObject._body) {
                this.transform.setWorldPosition(this.gameObject._body.position.x, this.gameObject._body.position.y);
                this.transform.worldAngle = this.gameObject._body.angle;
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
            this._screenPosition = Alviss.Vector2.Zero();
            gameObject.spriteRenderer = this;
        }
        destroy() {
            super.destroy();
            this.gameObject.spriteRenderer = undefined;
        }
        serialize() {
            return {
                s: this.sprite ? this.sprite.serialize() : undefined
            };
        }
        deserialize(data) {
            if (data) {
                if (data.s) {
                    this.sprite = new Alviss.Sprite();
                    this.sprite.deserialize(data.s);
                }
            }
        }
        _render(camera) {
            this._screenPosition.copyFrom(this.transform.getWorldPosition());
            if (camera) {
                this._screenPosition.subtractInPlace(camera.transform.getWorldPosition());
                this._screenPosition.addInPlace(this.engine.width * 0.5, this.engine.height * 0.5);
            }
            this.engine.context.translate(this._screenPosition.x, this.engine.height - this._screenPosition.y);
            this.engine.context.rotate(-this.transform.worldAngle);
            this.engine.context.drawImage(this.sprite.image, -this.sprite.image.width * 0.5, -this.sprite.image.height * 0.5);
            this.engine.context.rotate(this.transform.worldAngle);
            this.engine.context.translate(-this._screenPosition.x, -this.engine.height + this._screenPosition.y);
        }
    }
    Alviss.SpriteRenderer = SpriteRenderer;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class RectangleCollider extends Alviss.Collider {
        constructor(gameObject) {
            super(gameObject);
            this._tmpProject = Alviss.Vector2.Zero();
            this.name = "SquareCollider";
            this.width = 8;
            this.height = 8;
            if (this.gameObject.spriteRenderer) {
                if (this.gameObject.spriteRenderer.sprite) {
                    if (this.gameObject.spriteRenderer.sprite.image) {
                        if (this.gameObject.spriteRenderer.sprite.image.width > 0) {
                            this.width = this.gameObject.spriteRenderer.sprite.image.width;
                            this.height = this.gameObject.spriteRenderer.sprite.image.height;
                        }
                    }
                }
            }
        }
        get x0() {
            return this.transform.getWorldPosition().x - this.width * 0.5;
        }
        get x1() {
            return this.transform.getWorldPosition().x + this.width * 0.5;
        }
        get y0() {
            return this.transform.getWorldPosition().y - this.height * 0.5;
        }
        get y1() {
            return this.transform.getWorldPosition().y + this.height * 0.5;
        }
        serialize() {
            return {
                w: this.width,
                h: this.height
            };
        }
        deserialize(data) {
            if (data) {
                if (isFinite(data.w)) {
                    this.width = data.w;
                }
                if (isFinite(data.h)) {
                    this.height = data.h;
                }
            }
        }
        intersects(other) {
            if (other instanceof Alviss.DiscCollider) {
                return this.intersectsDisc(other);
            }
            else if (other instanceof RectangleCollider) {
                return this.intersectsSquare(other);
            }
            return undefined;
        }
        intersectsDisc(other) {
            this._tmpProject.copyFrom(other.transform.getWorldPosition());
            this._tmpProject.clampXInPlace(this.x0, this.x1);
            this._tmpProject.clampYInPlace(this.y0, this.y1);
            if (Alviss.Vector2.DistanceSquared(other.transform.getWorldPosition(), this._tmpProject) < other.radius * other.radius) {
                let collision = new Alviss.Collision(other);
                collision.contact = this._tmpProject.subtract(other.transform.getWorldPosition());
                collision.contact.normalizeInPlace();
                collision.contact.scaleInPlace(other.radius);
                collision.contact.addInPlace(other.transform.getWorldPosition());
            }
            return undefined;
        }
        intersectsSquare(other) {
            if (this.x1 < other.x0 || this.x0 > other.x1 || this.y1 < other.y0 || this.y0 > other.y1) {
                return undefined;
            }
            let collision = new Alviss.Collision(other);
            collision.contact = this.transform.getWorldPosition().clone();
            collision.contact.clampXInPlace(other.x0, other.x1);
            collision.contact.clampYInPlace(other.y0, other.y1);
            return collision;
        }
    }
    Alviss.RectangleCollider = RectangleCollider;
})(Alviss || (Alviss = {}));
var Alviss;
(function (Alviss) {
    class Transform extends Alviss.Component {
        constructor(gameObject) {
            super(gameObject);
            this._worldPositionIsDirty = true;
            this._worldPosition = Alviss.Vector2.Zero();
            this._localPosition = Alviss.Vector2.Zero();
            this._localAngle = 0;
            this.depth = 0;
            this.children = new Alviss.List();
            this.name = "Transform";
            gameObject.transform = this;
        }
        getWorldPosition() {
            if (this._worldPositionIsDirty) {
                this._worldPosition.copyFrom(this._localPosition);
                if (this.parent) {
                    this._worldPosition.rotateInPlace(this.parent.worldAngle);
                    this._worldPosition.addInPlace(this.parent.getWorldPosition());
                }
                this._worldPositionIsDirty = false;
            }
            return this._worldPosition;
        }
        setWorldPosition(p, y) {
            let v;
            if (p instanceof Alviss.Vector2) {
                v = p;
            }
            else {
                v = Alviss.Vector2.Tmp(p, isFinite(y) ? y : 0);
            }
            this._localPosition.copyFrom(v);
            if (this.parent) {
                this._localPosition.subtractInPlace(this.parent.getWorldPosition());
                this._localPosition.rotateInPlace(-this.parent.worldAngle);
            }
            this.flagWorldPosDirty();
            if (this.gameObject._body) {
                this.gameObject._body.position.x = this.getWorldPosition().x;
                this.gameObject._body.position.y = this.getWorldPosition().y;
            }
        }
        getLocalPosition() {
            return this._localPosition;
        }
        setLocalPosition(p, y) {
            let v;
            if (p instanceof Alviss.Vector2) {
                v = p;
            }
            else {
                v = Alviss.Vector2.Tmp(p, isFinite(y) ? y : 0);
            }
            this._localPosition.copyFrom(v);
            this.flagWorldPosDirty();
            if (this.gameObject._body) {
                this.gameObject._body.position.x = this.getWorldPosition().x;
                this.gameObject._body.position.y = this.getWorldPosition().y;
            }
        }
        get localAngle() {
            return this._localAngle;
        }
        set localAngle(a) {
            this._localAngle = a;
            this.flagWorldPosDirty();
        }
        get worldAngle() {
            if (this.parent) {
                return this.parent.worldAngle + this.localAngle;
            }
            return this.localAngle;
        }
        set worldAngle(a) {
            if (this.parent) {
                this.localAngle = a - this.parent.worldAngle;
            }
            else {
                this.localAngle = a;
            }
        }
        get parent() {
            return this._parent;
        }
        set parent(t) {
            if (this._parent) {
                this._parent.children.remove(this);
            }
            this._parent = t;
            if (this._parent) {
                this._parent.children.push(this);
            }
            this.flagWorldPosDirty();
        }
        flagWorldPosDirty() {
            this._worldPositionIsDirty = true;
            this.children.forEach((c) => {
                c.flagWorldPosDirty();
            });
        }
        destroy() {
            this.gameObject.transform = undefined;
        }
        serialize() {
            return {
                x: this._localPosition.x,
                y: this._localPosition.y,
                a: this.localAngle
            };
        }
        deserialize(data) {
            if (data) {
                if (isFinite(data.x) && isFinite(data.y)) {
                    this.setLocalPosition(data.x, data.y);
                }
                if (isFinite(data.a)) {
                    this.localAngle = data.a;
                }
            }
        }
        Translate(v, y) {
            let vector;
            if (v instanceof Alviss.Vector2) {
                vector = v;
            }
            else {
                vector = Alviss.Vector2.Tmp(v, y);
            }
            this._localPosition.addInPlace(vector);
            this.flagWorldPosDirty();
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
        static CreateRectangleSprite(width, height, red = 1, green = 1, blue = 1, alpha = 1) {
            let buffer = new Uint8ClampedArray(width * height * 4);
            for (let j = 0; j < height; j++) {
                for (let i = 0; i < width; i++) {
                    let index = i + j * width;
                    buffer[index * 4] = red;
                    buffer[index * 4 + 1] = green;
                    buffer[index * 4 + 2] = blue;
                    buffer[index * 4 + 3] = alpha;
                }
            }
            return new Alviss.Sprite(new ImageData(buffer, width, height));
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
