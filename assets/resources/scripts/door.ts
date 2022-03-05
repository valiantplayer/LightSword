// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Uinfo } from "./Global/Uinfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class door extends cc.Component {
  goNext;

  @property(cc.Node)
  blackmask: cc.Node = null;

  playerFollower;
  ui;
  onLoad() {
    cc.director.getCollisionManager().enabled = true;
    this.ui = cc.find("Canvas/UI_Camera/UILayer");
    this.playerFollower = cc.find("Canvas/playerFollower");
    this.goNext = false;
    this.blackmask = cc.find("Canvas/blackmask");
  }

  start() {}
  onCollisionEnter(other, self) {
    if (this.goNext == false) {
      //确保只触发一次
      this.goNext = true;

      //屏幕渐暗动画
      this.blackmask.getComponent(cc.Animation).play("blackmask");
      let state = this.blackmask
        .getComponent(cc.Animation)
        .getAnimationState("blackmask");
      state.speed = 2;
      //死亡黑幕

      this.blackmask.active = true;
      this.blackmask.zIndex = 999;

      //3.5秒后切换场景
      setTimeout(() => {
        cc.director.loadScene("MainStage");
      }, 1500);
    }
  }
  update(dt) {
    if (this.goNext == true) {
      this.ui.opacity -= 5;
      this.blackmask.x = this.playerFollower.x;
    }
  }
}
