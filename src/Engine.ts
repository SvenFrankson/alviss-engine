module Alviss {

    export class Engine {

        public scenes: List<Scene> = new List<Scene>();
        public keyboard: KeyBoard;
        public pad: Pad;
        public input: Input;

        constructor(public context: CanvasRenderingContext2D, public width: number, public height: number) {
            this.keyboard = new KeyBoard(this);
            this.pad = new Pad(this);
            this.input = new Input(this);
            setInterval(
                () => {
                    this.scenes.forEach(
                        (scene) => {
                            scene.updatePhysic();
                        }
                    );
                    this.scenes.forEach(
                        (scene) => {
                            scene.update();
                        }
                    );
                    this.context.fillStyle = "black";
                    this.context.fillRect(0, 0, this.width, this.height);
                    this.scenes.forEach(
                        (scene) => {
                            scene.render();
                        }
                    );
                    this.keyboard.clearKeyPressed();
                    this.pad.clearPadPressed();
                },
                15
            );
        }
    }
}