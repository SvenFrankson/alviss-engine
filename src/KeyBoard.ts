module Alviss {

    export class KeyBoard {

        public keyDowned: List<string> = new List<string>();
        public keyPressed: List<string> = new List<string>();
        public keyUped: List<string> = new List<string>();

        constructor(public engine: Engine) {
            window.addEventListener("keydown", this._keyDown);
            window.addEventListener("keyup", this._keyUp);
        }

        public destroy(): void {
            window.removeEventListener("keydown", this._keyDown);
            window.removeEventListener("keyup", this._keyUp);
        }

        public clearKeyPressed(): void {
            while (this.keyPressed.length > 0) {
                this.keyPressed.removeAt(0);
            }
        }

        private _keyDown = (event: KeyboardEvent) => {
            this.keyDowned.push(event.key);
            this.keyPressed.push(event.key);
        }

        private _keyUp = (event: KeyboardEvent) => {
            this.keyUped.push(event.key);
            this.keyDowned.remove(event.key);
        }
    }
}