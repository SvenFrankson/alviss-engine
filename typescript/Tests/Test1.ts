class TestMBH1 extends MonoBehaviour {
    
    public update(): void {
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

/*
window.onload = () => {
    let canvas = document.getElementById("render-canvas-1");
    if (canvas instanceof HTMLCanvasElement) {
        canvas.width = 60;
        canvas.height = 40;
        let context = canvas.getContext("2d");
        let engine = new Engine(context, canvas.width, canvas.height);
        let scene = new Scene(engine);
        let g = new GameObject(scene);
        g.position.x = 25;
        g.position.y = 30;
        new TestMBH1(g);
    }
}
*/