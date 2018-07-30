/// <reference path="../../dist/alviss.d.ts"/>

class Main {

    public static Run(): void {
        let canvas = document.getElementById("render-canvas-snake");
        if (canvas instanceof HTMLCanvasElement) {
            canvas.width = 128;
            canvas.height = 128;
            let context = canvas.getContext("2d");
            let engine = new Alviss.Engine(context, canvas.width, canvas.height);
            let scene = new Alviss.Scene(engine);
            let g = new Alviss.GameObject(scene);
            g.transform.position.x = 25;
            g.transform.position.y = 30;
            new Snake(g);
        }
    }
}