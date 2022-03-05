import { findNode } from "../Global/global";
import { Uinfo } from "../Global/Uinfo";
import player from "./player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class playerHurtBox extends cc.Component {
  @property(cc.Material)
  Material: cc.Material = null;
  @property(cc.Material)
  Material_before: cc.Material = null;
  @property(cc.Prefab)
  Hit_Effect: cc.Prefab = null;
  @property(cc.Node)
  player: cc.Node = null;

  @property(cc.Node)
  player_parent: cc.Node = null;

  player_script;
  player_animation;
  Timer;
  Canvas;

  hp_star: cc.Node;
  protected onLoad(): void {
    cc.director.getCollisionManager().enabled = true;
    this.Canvas = cc.find("Canvas");
    this.hp_star = findNode(this.Canvas, "hp_star");
  }
  start() {
    this.player_script = this.player.getComponent(player);
    this.player_animation = this.player_script.node.getComponent(cc.Animation);
  }

  clearHp() {
    this.hp_star.children[Uinfo.player_hp - 1].getChildByName(
      "hp_full"
    ).active = false;
    this.hp_star.children[Uinfo.player_hp - 1].getChildByName(
      "hp_empty"
    ).active = true;
    Uinfo.player_hp--;
    if (Uinfo.player_hp <= 0) {
      Uinfo.player_hp = 0;
      Uinfo.player_state = "death";
      this.player_animation.play("death");
      findNode(this.Canvas, "UILayer").destroy();
      //死亡黑幕
      let blackmask: cc.Node = findNode(this.Canvas, "blackmask");
      blackmask.active = true;
      blackmask.zIndex = 999;
      blackmask.setPosition(this.player_parent.x + 180, this.player_parent.y);
      blackmask.getComponent(cc.Animation).play("blackmask");
      setTimeout(() => {
        cc.director.loadScene("Death");
      }, 3500);
      return;
    }
  }
  onCollisionEnter(other, self) {
    this.clearHp();
    this.player_parent.getComponent(cc.Animation).play("player_hurt");
    let hit_effect: cc.Node = cc.instantiate(this.Hit_Effect);
    this.node.addChild(hit_effect);
    // hit_effect.setPosition(cc.v2(this.node.x, this.node.y));
    this.player.getComponent(cc.Sprite).setMaterial(0, this.Material);
    // this.node.getComponent(cc.Sprite).setMaterial(0, this.Material_before);
    this.node.getComponent(cc.AudioSource).play();
  }
  onCollisionExit(other, self) {
    this.player.getComponent(cc.Sprite).setMaterial(0, this.Material_before);
    // this.player_script.finish();
  }
}
