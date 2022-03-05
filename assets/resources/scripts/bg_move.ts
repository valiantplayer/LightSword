const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property
  speed: number = 0;

  camera: cc.Node;
  originPos: number;
  moveDistance: number;
  onLoad() {
    this.camera = cc.find("Canvas/playerFollower");
    this.originPos = this.node.x;
  }

  start() {}

  update(dt) {
    this.moveDistance = this.camera.x * this.speed;
    this.node.x = this.originPos - this.moveDistance;
  }
}
