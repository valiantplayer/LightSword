import player from "./player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class playerHitBox extends cc.Component {
  @property(cc.Node)
  player: cc.Node = null;

  player_script;
  protected onLoad(): void {
    cc.director.getCollisionManager().enabled = true;
    cc.director.getPhysicsManager().enabled = true;
    this.player_script = this.player.getComponent(player);
  }

  onCollisionEnter(other, self) {}
  onCollisionExit(other, self) {
    // this.player_script.finish();
  }
}
