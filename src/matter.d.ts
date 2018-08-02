declare module Matter {
    class Engine {
        static create(): Engine;
        static run(engine: Engine): void;
        static update(engine: Engine, deltaTime: number): void;
        world: World;
    }

    interface IGravity {
        x: number;
        y: number;
        scale: number;
    }

    class World {
        static add(world: World, bodies: Body[]): void;
        gravity: IGravity;
    }

    interface IBodyOptions {
        isStatic: boolean;
    }

    class Bodies {
        static rectangle(x: number, y: number, width: number, height: number, options?: IBodyOptions): Body;
        static circle(x: number, y: number, radius: number, options?: IBodyOptions): Body;
    }

    interface IVector {
        x: number;
        y: number;
    }

    class Body {
        static setPosition(body: Body, position: IVector): void;
        static setAngle(body: Body, angle: number): void;
        static setMass(body: Body, mass: number): void;
        position: IVector;
        angle: number;
        isStatic: boolean;
    }
}