module Alviss {

    export class Sprite {

        public image: HTMLImageElement;

        constructor(public data: ImageData) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = data.width;
            canvas.height = data.height;
            ctx.putImageData(data, 0, 0);

            this.image = document.createElement("img");
            this.image.src = canvas.toDataURL();
        }
    }
}