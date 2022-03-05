// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { findNode } from "./Global/global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_start extends cc.Component {
  Player: cc.Node;
  isrun: boolean;
  player_animation;
  onLoad() {
    this.Player = findNode(this.node, "Player");
    this.player_animation = this.Player.getChildByName("player").getComponent(
      cc.Animation
    );
    this.isrun = true;
  }

  start() {
    //场景出现时,角色播放走路动画
    this.player_animation.play("run_action");

    setTimeout(() => {
      this.isrun = false;
      this.player_animation.play("stand_action");
      //ui出现
      findNode(this.node, "UILayer").active = true;
    }, 1600);
  }
  update(dt) {
    //角色屏幕外走到屏幕内
    if (this.isrun == true) {
      this.player_animation.node.parent.x += 130 * (1 / 60);
    }
  }
}
