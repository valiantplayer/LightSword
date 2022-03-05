const { ccclass, property } = cc._decorator;

@ccclass
export default class ball extends cc.Component {
  @property(cc.Prefab)
  dust: cc.Prefab = null;

  Dust;
  dirction: number;
  hp = 5;

  protected start(): void {
    this.node.group = "Play_hitBoxer";
    this.Dust = cc.instantiate(this.dust);
    this.node.addChild(this.Dust);
    this.Dust.scaleX = this.node.scaleX;
    this.Dust.y = -20;
    this.node.getComponent(cc.AudioSource).play();
  }

  update(dt) {
    this.node.x += 400 * dt * this.dirction;
    this.Dust.x += 30 * dt * this.dirction;
    if (this.hp <= 0) {
      this.node.destroy();
    }
  }

  onCollisionEnter(other, self) {
    this.hp--;
  }
  onCollisionExit(other, self) {}
}
