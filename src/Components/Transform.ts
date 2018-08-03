module Alviss {

    export class Transform extends Component {

        private _worldPositionIsDirty: boolean = true;
        private _worldPosition: Vector2 = Vector2.Zero();
        public getWorldPosition(): Vector2 {
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
        public setWorldPosition(p: Vector2): void;
        public setWorldPosition(x: number, y: number): void;
        public setWorldPosition(p: Vector2 | number, y?: number): void {
            let v: Vector2;
            if (p instanceof Vector2) {
                v = p;
            }
            else {
                v = Vector2.Tmp(p, isFinite(y) ? y : 0);
            }
            this._localPosition.copyFrom(v);
            if (this.parent) {
                this._localPosition.subtractInPlace(this.parent.getWorldPosition());
                this._localPosition.rotateInPlace(- this.parent.worldAngle);
            }
            this.flagWorldPosDirty();
            if (this.gameObject._body) {
                this.gameObject._body.position.x = this.getWorldPosition().x;
                this.gameObject._body.position.y = this.getWorldPosition().y;
            }
        }

        private _localPosition: Vector2 = Vector2.Zero();
        public getLocalPosition(): Vector2 {
            return this._localPosition;
        }
        public setLocalPosition(p: Vector2): void;
        public setLocalPosition(x: number, y: number): void;
        public setLocalPosition(p: Vector2 | number, y?: number): void {
            let v: Vector2;
            if (p instanceof Vector2) {
                v = p;
            }
            else {
                v = Vector2.Tmp(p, isFinite(y) ? y : 0);
            }
            this._localPosition.copyFrom(v);
            this.flagWorldPosDirty();
            if (this.gameObject._body) {
                this.gameObject._body.position.x = this.getWorldPosition().x;
                this.gameObject._body.position.y = this.getWorldPosition().y;
            }
        }

        private _localAngle: number = 0;
        public get localAngle(): number {
            return this._localAngle;
        }
        public set localAngle(a: number) {
            this._localAngle = a;
            this.flagWorldPosDirty();
        }
        public get worldAngle(): number {
            if (this.parent) {
                return this.parent.worldAngle + this.localAngle;
            }
            return this.localAngle;
        }
        public set worldAngle(a: number) {
            if (this.parent) {
                this.localAngle = a - this.parent.worldAngle;
            }
            else {
                this.localAngle = a;
            }
        }

        public depth: number = 0;

        private _parent: Transform;
        public get parent(): Transform {
            return this._parent;
        }
        public set parent(t: Transform) {
            if (this._parent) {
                this._parent.children.remove(this);
            }
            this._parent = t;
            if (this._parent) {
                this._parent.children.push(this);
            }
            this.flagWorldPosDirty();
        }
        public children: List<Transform> = new List<Transform>();
        public flagWorldPosDirty(): void {
            this._worldPositionIsDirty = true;
            this.children.forEach(
                (c) => {
                    c.flagWorldPosDirty();
                }
            )
        }

        constructor(gameObject: GameObject) {
            super(gameObject);
            this.name = "Transform";
            gameObject.transform = this;
        }

        public destroyImmediate(): void {
            super.destroyImmediate();
            this.gameObject.transform = undefined;
        }

        public serialize(): any {
            return {
                x: this._localPosition.x,
                y: this._localPosition.y,
                a: this.localAngle
            };
        }

        public deserialize(data: any) {
            if (data) {
                if (isFinite(data.x) && isFinite(data.y)) {
                    this.setLocalPosition(data.x, data.y);
                }
                if (isFinite(data.a)) {
                    this.localAngle = data.a;
                }
            }
        }

        public Translate(v: Vector2): void;
        public Translate(x: number, y: number): void;
        public Translate(v: Vector2 | number, y?: number): void {
            let vector: Vector2;
            if (v instanceof Vector2) {
                vector = v;
            }
            else {
                vector = Vector2.Tmp(v, y);
            }
            this._localPosition.addInPlace(vector);
            this.flagWorldPosDirty();
        }

        public Rotate(a: number): void {
            this.localAngle += a;
        }
    }
}