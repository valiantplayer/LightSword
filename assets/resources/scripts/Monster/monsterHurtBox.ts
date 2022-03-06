import { findNode } from "../Global/global";
import { Uinfo } from "../Global/Uinfo";
import monster from "./monster";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MonsterHurtBox extends cc.Component {
  @property(cc.Material)
  Material: cc.Material = null;
  @property(cc.Material)
  Material_before: cc.Material = null;
  @property(cc.Prefab)
  Hit_Effect: cc.Prefab = null;
  @property(cc.Node)
  monster: cc.Node = null;
  @property(cc.Node)
  monster_parent: cc.Node = null;
  @property(cc.ProgressBar)
  monster_hp: cc.ProgressBar = null;

  hit_effect: cc.Node;
  maxHp: number;
  Hp: number;
  progressBar: cc.ProgressBar;
  hitBack: number = 0;
  player: cc.Node;

  monster_scrpit;

  start() {
    let Monster: monster = this.node.parent.getComponent(monster);
    this.monster_scrpit = this.node.parent.getComponent(monster);
    //获得怪物最大血量
    this.maxHp = Monster.maxHp;
    //获得怪物当前血量
    this.Hp = Monster.Hp;
    //血量进度条
    this.progressBar = this.monster_hp.getComponent(cc.ProgressBar);
    this.progressBar.progress = 1;
    this.progressBar.node.active = false;
    this.player = findNode(cc.find("Canvas"), "Player");
  }
  //每次挨打后刷新血量
  refreshHp() {
    if (this.monster_scrpit.monster_state != "Death") {
      this.progressBar.node.active = true;
    }
    this.Hp -= 10;
    if (this.Hp < 0) {
      this.Hp = 0;
    }
    this.progressBar.progress = this.Hp / this.maxHp;
    if (this.Hp == 0 && this.monster_scrpit.monster_state != "Death") {
      this.die();
    }
  }
  //增加挨打粒子特效
  HitShader(state?: string) {
    this.hit_effect = cc.instantiate(this.Hit_Effect);
    this.node.addChild(this.hit_effect);
    if (state == "Death") {
      this.hit_effect.setPosition(
        this.hit_effect.x + 25,
        this.hit_effect.y - 25
      );
    }
    this.monster.getComponent(cc.Sprite).setMaterial(0, this.Material);
    this.node.getComponent(cc.AudioSource).play();
    //销毁粒子特效
    setTimeout(() => {
      this.hit_effect.destroy();
    }, 500);
  }
  //挨打时
  hurting() {
    //播放挨打动画
    this.monster_parent.getComponent(cc.Animation).play("monster_hurt");
    if (this.monster_scrpit.monster_state == "Death") {
      this.HitShader("Death");
    } else {
      this.HitShader();
    }
  }
  //挨打结束
  hurtOver() {
    this.monster.getComponent(cc.Sprite).setMaterial(0, this.Material_before);
  }
  //怪物死亡
  die() {
    Uinfo.monster_number--;
    this.monster_scrpit.monster_state = "Death";
    this.node.parent.getComponent(cc.Animation).play("monster_die");
    this.progressBar.node.active = false;
    if (Uinfo.monster_number == 0) {
      Uinfo.Black();
    }
  }
  onCollisionEnter(other, self) {
    this.refreshHp();
    if (this.monster_scrpit.monster_state != "Death") {
      this.hitBack = 300;
    }
    this.hurting();
  }
  onCollisionExit(other, self) {
    this.hurtOver();
  }

  protected update(dt: number): void {
    if (this.monster_scrpit.monster_state == "Death") {
      if (this.player.x < this.monster_parent.x) {
        this.monster_parent.x += this.hitBack * dt;
      } else {
        this.monster_parent.x -= this.hitBack * dt;
      }
      if (this.hitBack >= 10) {
        this.hitBack -= 10;
      }
      if (this.hitBack <= 0) {
        this.hitBack = 0;
      }
    }
  }
}
