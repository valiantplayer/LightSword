import { findNode } from "./global";

export namespace Uinfo {
  export let player_state: string; //玩家的状态 //move移动，attack攻击，stand站立,dash冲刺,jump跳跃,special_attack技能攻击
  // export let monster_state: string; //怪物的状态 //Left，Right移动，Attack攻击，Stand站立，Chase//追赶玩家,Death//死亡
  export let player_dirction: string; //玩家的左右方向  //Left,Right

  export let isPress: boolean; //是否一直按着左右键
  export let player_hp = 5; //玩家的血量
  export let monster_number = 3;

  //过关黑雾
  export function Black() {
    findNode(cc.find("Canvas"), "UILayer").destroy();
    //死亡黑幕
    let blackmask: cc.Node = findNode(cc.find("Canvas"), "blackmask");
    blackmask.active = true;
    blackmask.zIndex = 999;
    let Player = findNode(cc.find("Canvas"), "Player");
    blackmask.setPosition(Player.x + 160, Player.y + 20);
    blackmask.getComponent(cc.Animation).play("blackmask");
    setTimeout(() => {
      cc.director.loadScene("Death");
    }, 3500);
  }
}
