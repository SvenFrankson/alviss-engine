class SpriteTools {

    public static CreateSquareSprite(size: number, red: number = 1, green: number = 1, blue: number = 1, alpha: number = 1): ImageData {
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
        return new ImageData(buffer, size, size);
    }

    public static CreateSprite(ascii: string, red: number = 1, green: number = 1, blue: number = 1, alpha: number = 1): ImageData {
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
        return new ImageData(buffer, width, height);
    }
}