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

    class Bodies {
        static rectangle(x: number, y: number, width: number, height: number): Body;
        static circle(x: number, y: number, radius: number): Body;
    }

    interface IPosition {
        x: number;
        y: number;
    }

    class Body {
        position: IPosition;
    }
}