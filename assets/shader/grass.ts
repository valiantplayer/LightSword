const { ccclass, property } = cc._decorator;

@ccclass
export default class grass extends cc.Component {
  @property
  height: number = 0;
  @property
  speed: number = 0;
  @property
  swing: number = 0;

  material: cc.Material = null;
  time: number = 0;

  onLoad() {}

  start() {
    //设置grass 的shader 参数 (Set the shader parameters of "cao.effect")
    this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
    this.material.setProperty("height", this.height);
    this.material.setProperty("speed", this.speed);
  }

  update(dt) {
    //让草开始摆动  (Let the grass start to swing)
    this.time += dt * this.swing;
    if (this.node.active && this.material != null) {
      this.material.setProperty("time", this.time);
    }
  }
}
