namespace Alviss {

    export class SpriteTools {

        public static CreateSquareSprite(size: number, red: number = 1, green: number = 1, blue: number = 1, alpha: number = 1): Sprite {
            let buffer = new Uint8ClampedArray(size * size * 4);
            for (let j = 0; j < size; j++) {
                for (let i = 0; i < size; i++) {
                    let index = i + j * size;
                    buffer[index * 4] = red;
                    buffer[index * 4 + 1] = green;
                    buffer[index * 4 + 2] = blue;
                    buffer[index * 4 + 3] = alpha;
                }
            }
            return new Sprite(new ImageData(buffer, size, size));
        }

        public static CreateRectangleSprite(width: number, height: number, red: number = 1, green: number = 1, blue: number = 1, alpha: number = 1): Sprite {
            let buffer = new Uint8ClampedArray(width * height * 4);
            for (let j = 0; j < height; j++) {
                for (let i = 0; i < width; i++) {
                    let index = i + j * width;
                    buffer[index * 4] = red;
                    buffer[index * 4 + 1] = green;
                    buffer[index * 4 + 2] = blue;
                    buffer[index * 4 + 3] = alpha;
                }
            }
            return new Sprite(new ImageData(buffer, width, height));
        }

        public static CreateDiscSprite(radius: number, red: number = 1, green: number = 1, blue: number = 1, alpha: number = 1): Sprite {
            let buffer = new Uint8ClampedArray(2 * radius * 2 * radius * 4);
            let radiusSquared = (radius) * (radius);
            for (let j = 0; j < 2 * radius; j++) {
                for (let i = 0; i < 2 * radius; i++) {
                    let index = i + j * 2 * radius;
                    if ((i - radius) * (i - radius) + (j - radius) * (j - radius) < radiusSquared) {
                        buffer[index * 4] = red;
                        buffer[index * 4 + 1] = green;
                        buffer[index * 4 + 2] = blue;
                        buffer[index * 4 + 3] = alpha;
                    }
                    else {
                        buffer[index * 4] = 0;
                        buffer[index * 4 + 1] = 0;
                        buffer[index * 4 + 2] = 0;
                        buffer[index * 4 + 3] = 0;
                    }
                }
            }
            return new Sprite(new ImageData(buffer, 2 * radius, 2 * radius));
        }

        public static CreateSprite(ascii: string, red: number = 1, green: number = 1, blue: number = 1, alpha: number = 1): Sprite {
            ascii = ascii.trim();
            while (ascii.indexOf(" ") !== -1) {
                ascii = ascii.replace(" ", "");
            }
            let lines = ascii.split("\n");
            let height = lines.length;
            let width = lines[0].length;
            for (let i = 1; i < lines.length; i++) {
                width = Math.max(width, lines[i].length);
            }
            let buffer = new Uint8ClampedArray(width * height * 4);
            for (let j = 0; j < height; j++) {
                for (let i = 0; i < width; i++) {
                    let index = i + j * width;
                    let v = 0;
                    let c = lines[j][i];
                    if (c) {
                        let n = parseInt(c);
                        if (n > 0 && n < 9) {
                            v = n / 8;
                        }
                    }
                    buffer[index * 4] = red * v;
                    buffer[index * 4 + 1] = green * v;
                    buffer[index * 4 + 2] = blue * v;
                    buffer[index * 4 + 3] = v === 0 ? 0 : alpha;
                }
            }
            return new Sprite(new ImageData(buffer, width, height));
        }
    }
}