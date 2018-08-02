namespace Alviss {

    export class Vector2 {

        constructor(
            public x: number = 0,
            public y: number = 0
        ) {

        }

        private static _tmp: Vector2 = Vector2.Zero();
        public static Tmp(x: number, y: number): Vector2 {
            Vector2._tmp.x = x;
            Vector2._tmp.y = y;
            return Vector2._tmp;
        }

        public static Zero(): Vector2 {
            return new Vector2(0, 0);
        }

        public static DistanceSquared(a: Vector2, b: Vector2): number {
            return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
        }

        public static Distance(a: Vector2, b: Vector2): number {
            return Math.sqrt(Vector2.DistanceSquared(a, b));
        }

        public static Dot(a: Vector2, b: Vector2): number {
            return a.x * b.x + a.y * b.y;
        }

        public copyFrom(other: Vector2): Vector2 {
            this.x = other.x;
            this.y = other.y;
            return this;
        }

        public clone(): Vector2 {
            return new Vector2(this.x, this.y);
        }

        public add(other: Vector2): Vector2;
        public add(x: number, y: number): Vector2;
        public add(other: Vector2 | number, y?: number): Vector2 {
            if (other instanceof Vector2) {
                return new Vector2(this.x + other.x, this.y + other.y);
            }
            else {
                return new Vector2(this.x + other, this.y + (isFinite(y) ? y : 0));
            }
        }


        public addInPlace(other: Vector2): Vector2;
        public addInPlace(x: number, y: number): Vector2;
        public addInPlace(other: Vector2 | number, y?: number): Vector2 {
            if (other instanceof Vector2) {
                this.x += other.x;
                this.y += other.y;
            }
            else {
                this.x += other;
                this.y += isFinite(y) ? y :0
            }
            return this;
        }

        public subtract(other: Vector2): Vector2;
        public subtract(x: number, y: number): Vector2;
        public subtract(other: Vector2 | number, y?: number): Vector2 {
            if (other instanceof Vector2) {
                return new Vector2(this.x - other.x, this.y - other.y);
            }
            else {
                return new Vector2(this.x - other, this.y - (isFinite(y) ? y : 0));
            }
        }


        public subtractInPlace(other: Vector2): Vector2;
        public subtractInPlace(x: number, y: number): Vector2;
        public subtractInPlace(other: Vector2 | number, y?: number): Vector2 {
            if (other instanceof Vector2) {
                this.x -= other.x;
                this.y -= other.y;
            }
            else {
                this.x -= other;
                this.y -= isFinite(y) ? y :0
            }
            return this;
        }

        public scale(s: number): Vector2 {
            return new Vector2(this.x * s, this.y * s);
        }

        public scaleInPlace(s: number): Vector2 {
            this.x *= s;
            this.y *= s;
            return this;
        }

        public multiply(other: Vector2): Vector2;
        public multiply(x: number, y: number): Vector2;
        public multiply(other: Vector2 | number, y?: number): Vector2 {
            if (other instanceof Vector2) {
                return new Vector2(this.x * other.x, this.y * other.y);
            }
            else {
                return new Vector2(this.x * other, this.y * (isFinite(y) ? y : 0));
            }
        }


        public multiplyInPlace(other: Vector2): Vector2;
        public multiplyInPlace(x: number, y: number): Vector2;
        public multiplyInPlace(other: Vector2 | number, y?: number): Vector2 {
            if (other instanceof Vector2) {
                this.x *= other.x;
                this.y *= other.y;
            }
            else {
                this.x *= other;
                this.y *= isFinite(y) ? y :0
            }
            return this;
        }

        public normalize(): Vector2 {
            let l = this.length();
            return new Vector2(this.x / l, this.y / l);
        }

        public normalizeInPlace(): Vector2 {
            let l = this.length();
            this.x /= l;
            this.y /= l;
            return this;
        }

        public clampX(minX: number, maxX: number): Vector2 {
            return new Vector2(
                Math.max(Math.min(this.x, maxX), minX),
                this.y
            );
        }

        public clampXInPlace(minX: number, maxX: number): Vector2 {
            this.x = Math.max(Math.min(this.x, maxX), minX);
            return this;
        }

        public clampY(minY: number, maxY: number): Vector2 {
            return new Vector2(
                this.y,
                Math.max(Math.min(this.y, maxY), minY)
            );
        }

        public clampYInPlace(minY: number, maxY: number): Vector2 {
            this.y = Math.max(Math.min(this.y, maxY), minY);
            return this;
        }

        public mirror(n: Vector2): Vector2 {
            n = n.normalize();
            let proj = Vector2.Dot(this, n);
            return n.clone().scaleInPlace(- 2 * proj).addInPlace(this);
        }

        public mirrorInPlace(n: Vector2): Vector2 {
            n = n.normalize();
            let proj = Vector2.Dot(this, n);
            this.subtractInPlace(n.clone().scaleInPlace(2 * proj));
            return this;
        }

        public rotate(a: number): Vector2 {
            let cosa = Math.cos(a);
            let sina = Math.sin(a);
            return new Vector2(
                this.x * cosa - this.y * sina,
                this.x * sina + this.y * cosa
            );
        }

        public rotateInPlace(a: number): Vector2 {
            let cosa = Math.cos(a);
            let sina = Math.sin(a);
            let x = this.x;
            let y = this.y;
            this.x = x * cosa - y * sina;
            this.y = x * sina + y * cosa;
            return this;
        }

        public lengthSquared(): number {
            return this.x * this.x + this.y * this.y;
        }

        public length(): number {
            return Math.sqrt(this.lengthSquared());
        }
    }
}