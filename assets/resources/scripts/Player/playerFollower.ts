const { ccclass, property } = cc._decorator;

@ccclass
export default class playerFollower extends cc.Component {
  @property(cc.Node)
  player: cc.Node = null;

  @property
  distance: number = 0; //镜头跟随的最大长度

  start() {}

  update(dt) {
    if (this.node.x >= -(585 / 2) && this.node.x <= this.distance - 585 / 2) {
      //292.5~2500
      this.node.x = this.player.x;
    }
    if (this.node.x < 585 / 2) {
      this.node.x = 585 / 2; //<292.5
    }
    if (this.node.x > this.distance - 585 / 2) {
      this.node.x = this.distance - 585 / 2; //>2500
    }
  }
}
