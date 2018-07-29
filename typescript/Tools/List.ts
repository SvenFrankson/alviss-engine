class List<T> {
    
    public array: T[];

    constructor() {
        this.array = [];
    }

    public push(e: T) {
        if (this.array.indexOf(e) === - 1) {
            this.array.push(e);
        } 
    }

    public push_first(e: T) {
        if (this.array.indexOf(e) === - 1) {
            this.array.splice(0, 0, e);
        }
    }

    public remove(e: T) {
        let i = this.array.indexOf(e);
        if (i >= 0) {
            this.array.splice(i, 1);
        }
    }

    public removeAt(i: number) {
        this.array.splice(i, 1);
    }

    public pop_first(): T {
        if (this.length > 0) {
            let e = this.get(0);
            this.removeAt(0);
            return e;
        }
    }

    public pop_last(): T {
        return this.array.pop();
    }

    public first(predicate: (e: T) => boolean): T {
        for (let i = 0; i < this.array.length; i++) {
            if (predicate(this.array[i])) {
                return this.array[i];
            }
        }
        return undefined;
    }

    public indexOf(e: T): number {
        return this.array.indexOf(e);
    }

    public contains(e: T): boolean {
        return this.indexOf(e) !== -1;
    }

    public sort(compareFn: (a: T, b: T) => number) {
        this.array.sort(compareFn);
    }

    public forEach(func: (a: T, i: number) => void) {
        this.array.forEach(func);
    }

    public get(i: number): T {
        return this.array[i];
    }

    public get length(): number {
        return this.array.length;
    }
}