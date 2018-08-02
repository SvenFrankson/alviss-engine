module Alviss {

    export class Sprite {

        private _src: string;
        private _data: ImageData;
        public image: HTMLImageElement;

        constructor();
        constructor(src: string);
        constructor(data: ImageData);
        constructor(arg?: string | ImageData) {
            this.image = document.createElement("img");
            if (arg === undefined) {
                return;
            }
            let src = "";
            if (arg instanceof ImageData) {
                this._data = arg;
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = arg.width;
                canvas.height = arg.height;
                ctx.putImageData(arg, 0, 0);
    
                src = canvas.toDataURL();
            }
            else if (typeof(arg) === "string") {
                this._src = arg;
                src = arg;
            }
            this.image.src = src;
        }

        public serialize(): any {
            if (this._src) {
                return {
                    src: this._src
                }
            }
            if (this._data) {
                return {
                    w: this._data.width,
                    h: this._data.height,
                    data: this._data.data
                }
            }
        }

        public deserialize(data: any): void {
            if (data) {
                if (data.src) {
                    this._src = data.src;
                    this.image.src = this._src;
                }
                else if (isFinite(data.w) && isFinite(data.h) && data.data) {
                    this._data = new ImageData(data.data, data.w, data.h);
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    canvas.width = this._data.width;
                    canvas.height = this._data.height;
                    ctx.putImageData(this._data, 0, 0);
                    this.image.src = canvas.toDataURL();
                }
            }
        }
    }
}