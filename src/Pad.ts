module Alviss {
    
    export enum PadButton {
        Up,
        Down,
        Left,
        Right,
        A,
        B,
        X,
        Y
    }
    
    export class Pad {
    
        public static PadButtonToKey(padButton: PadButton): string {
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
            if (padButton === PadButton.A) {
                return "Space";
            }
            if (padButton === PadButton.B) {
                return "ControlLeft";
            }
        }
    
        public padDowned: List<PadButton> = new List<PadButton>();
        public padPressed: List<PadButton> = new List<PadButton>();
        public padUped: List<PadButton> = new List<PadButton>();
    
        constructor(public engine: Engine) {
            
        }
    
        public destroy(): void {
            
        }
    
        public clearPadPressed(): void {
            while (this.padPressed.length > 0) {
                this.padPressed.removeAt(0);
            }
        }
    
        public setPadDow(padButton: PadButton) {
            this.padDowned.push(padButton);
            this.padPressed.push(padButton);
        }
    
        public setPadUp(padButton: PadButton) {
            this.padUped.push(padButton);
            this.padDowned.remove(padButton);
        }
    }
}