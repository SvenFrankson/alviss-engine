module Alviss {

    export class Sprite {

        public image: HTMLImageElement;

        constructor(src: string);
        constructor(data: ImageData);
        constructor(arg: string | ImageData) {
            let src = "";
            this.image = document.createElement("img");
            if (arg instanceof ImageData) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = arg.width;
                canvas.height = arg.height;
                ctx.putImageData(arg, 0, 0);
    
                src = canvas.toDataURL();
            }
            else if (typeof(arg) === "string") {
                src = arg;
            }
            this.image.src = src;
        }
    }
}