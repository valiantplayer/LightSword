import { findNode } from "../Global/global";
import { Uinfo } from "../Global/Uinfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class monster extends cc.Component {
  startPos: number;
  left_distance; //左折返点
  right_distance; //右折返点
  monster_pos: cc.Vec3; //怪物的位置
  playerPos: cc.Vec3; //主角的位置
  distance: number; //主角和怪物之间的距离
  monster_animatiom; //怪物的动画

  @property
  maxHp: number = 0; //最大生命值

  @property
  range: number = 200; //巡逻范围
  Hp: number; //当前生命值
  Timer;

  monster_state;
  protected onLoad(): void {
    this.monster_state = "Left";
    this.startPos = this.node.x;
    this.left_distance = this.startPos - this.range;
    this.right_distance = this.startPos + this.range;
    this.monster_animatiom = this.node.getComponent(cc.Animation);
  }

  start() {
    this.Hp = this.maxHp;
  }

  //怪物追赶
  monster_chase() {
    this.monster_animatiom.play("monster_move");
    if (this.monster_state != "Death") {
      this.monster_state = "Chase";
    }
  }
  //怪物日常移动
  monster_move() {
    //为了方便统一使用monster和player的parent做计算
    this.monster_pos = this.node.parent.position;
    this.playerPos = findNode(this.node.parent.parent, "Player").position;
    this.distance = this.monster_pos.sub(this.playerPos).mag();

    //追赶玩家
    if (this.monster_state == "Chase") {
      if (this.node.parent.x >= this.playerPos.x) {
        this.node.parent.x -= 1;
        this.node.scaleX = 1; //转头
      } else if (this.node.parent.x < this.playerPos.x) {
        this.node.parent.x += 1;
        this.node.scaleX = -1; //转头
      } else if (this.node.parent.x == this.playerPos.x) {
      }
      if (this.distance < 50) {
        this.monster_state = "Attack";
        this.monster_animatiom.play("monster_atk");
        this.Timer = setTimeout(() => {
          this.monster_chase();
        }, 2000 + Math.random() * 500);
      }
    }

    if (this.monster_state == "Left") {
      this.node.parent.x += -1;
      if (this.node.parent.x <= this.left_distance) {
        this.monster_state = "Right";
        this.node.parent.scaleX = -1; //转头
      }
      //靠近玩家时候会自动追赶
      if (this.distance < 120) {
        this.monster_state = "Chase";
      }
    }
    if (this.monster_state == "Right") {
      this.node.parent.x += 1;
      if (this.node.parent.x >= this.right_distance) {
        this.monster_state = "Left";
        this.node.parent.scaleX = 1; //转头
      }
      //靠近玩家时候会自动追赶
      if (this.distance < 120) {
        this.monster_state = "Chase";
      }
    }
  }

  update(dt) {
    if (this.monster_state == "Death") {
      //怪物死亡，关闭定时器
      this.onClose();
      return;
    } else {
      this.monster_move();
    }
  }
  onClose() {
    clearTimeout(this.Timer);
    this.Timer = null;
  }
}
