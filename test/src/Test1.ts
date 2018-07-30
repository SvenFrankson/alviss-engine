class TestMBH1 extends Alviss.MonoBehaviour {

    public update(): void {
        super.update();
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Up)) {
            this.gameObject.transform.position.y += 1;
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Down)) {
            this.gameObject.transform.position.y -= 1;
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Right)) {
            this.gameObject.transform.position.x += 1;
        }
        if (this.engine.input.getPadButtonDown(Alviss.PadButton.Left)) {
            this.gameObject.transform.position.x -= 1;
        }
    }
}