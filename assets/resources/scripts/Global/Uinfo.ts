export namespace Uinfo {
  export let player_state: string; //玩家的状态 //move移动，attack攻击，stand站立,dash冲刺,jump跳跃,special_attack技能攻击
  // export let monster_state: string; //怪物的状态 //Left，Right移动，Attack攻击，Stand站立，Chase//追赶玩家,Death//死亡
  export let player_dirction: string; //玩家的左右方向  //Left,Right

  export let isPress: boolean; //是否一直按着左右键
  export let player_hp = 5; //玩家的血量
}
