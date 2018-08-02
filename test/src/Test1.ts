class TestMBH1 extends Alviss.MonoBehaviour {

    public Update(): void {
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Up)) {
            this.gameObject.transform.Translate(0, 1);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Down)) {
            this.gameObject.transform.Translate(0, -1);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.gameObject.transform.Translate(1, 0);
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.gameObject.transform.Translate(-1, 0);
        }
    }
}