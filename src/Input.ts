module Alviss {

    export class Input {

        constructor(public engine: Engine) {

        }

        public getKey(name: string): boolean {
            return this.engine.keyboard.keyPressed.contains(name);
        }

        public getKeyDown(name: string): boolean {
            return this.engine.keyboard.keyDowned.contains(name);
        }

        public getKeyUp(name: string): boolean {
            return this.engine.keyboard.keyUped.contains(name);
        }

        public getPadButton(padButton: PadButton): boolean {
            if (this.getKey(Pad.PadButtonToKey(padButton))) {
                return true;
            }
        }

        public getPadButtonDown(padButton: PadButton): boolean {
            if (this.getKeyDown(Pad.PadButtonToKey(padButton))) {
                return true;
            }
        }

        public getPadButtonUp(padButton: PadButton): boolean {
            if (this.getKeyUp(Pad.PadButtonToKey(padButton))) {
                return true;
            }
        }
    }
}