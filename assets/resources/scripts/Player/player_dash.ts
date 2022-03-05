import { findNode } from "../Global/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class player_dash extends cc.Component {
  player: cc.Node;
  player_sprite: cc.Sprite;

  protected onLoad(): void {
    this.player = findNode(this.node.parent, "player");
    this.player_sprite = this.player.getComponent(cc.Sprite);
  }
  start() {
    this.node.getComponent(cc.Sprite).spriteFrame =
      this.player_sprite.spriteFrame;
    this.node.scaleX = this.player.scaleX;
  }

  update(dt) {
    this.node.opacity -= 25;

    if (this.node.opacity <= 0) {
      this.node.destroy();
    }
  }
}
