import ball from "../ball";
import { Uinfo } from "../Global/Uinfo";

const { ccclass, property } = cc._decorator;
@ccclass
export default class player extends cc.Component {
  @property(cc.Node)
  swordSounds: cc.Node = null;
  @property(cc.Prefab)
  player_dash: cc.Prefab = null;
  @property(cc.Prefab)
  ball: cc.Prefab = null;

  speed: number = 150;
  direction: number = 0; //-1为左，1为右 0不动
  hitForce: number = 0; //攻击力趋向，增强打击感
  dashForce: number = 0; //冲刺力
  jumpForce: number = 0; //跳跃力
  jumpCount: number = 0; //跳跃的次数
  isFall: boolean; //跳跃后是否开始降落
  isDash: boolean;
  isRead: number = 0; //是否可以旋转
  player_audio;
  protected start(): void {
    this.player_audio = this.node.getComponent(cc.AudioSource);
    Uinfo.player_state = "stand";
  }
  soundRun() {
    this.player_audio.play("run");
  }
  soundsword() {
    this.player_audio.play("sound_sword");
  }
  hit() {
    //打击前倾距离
    this.node.parent.x += +this.hitForce * this.node.scaleX;
    if (this.hitForce > 0) {
      this.hitForce -= 0.5;
    } else if (this.hitForce < 0) {
      this.hitForce = 0;
    }
  }
  slowFall() {
    //模拟重力
    if (Uinfo.player_state == "jump" || Uinfo.player_state == "jumpAttack") {
      this.jumpForce -= 25;
    }
    if (Uinfo.player_state == "stand" && this.node.parent.y > 0) {
      this.jumpForce -= 25;
    }
  }
  jump(dt) {
    if (this.jumpForce < 0) {
      if (Uinfo.player_state != "jumpAttack") {
        if (!this.isFall) {
          this.node.getComponent(cc.Animation).play("fall");
          this.isFall = true;
        }
      }
    }
    this.slowFall();

    this.node.parent.y += this.jumpForce * dt;
    //着地
    if (this.node.parent.y < 0) {
      if (Uinfo.player_state == "jump") {
        Uinfo.player_state = "stand";
        if (Uinfo.isPress) {
          this.node.getComponent(cc.Animation).play("run_action");
        } else {
          this.node.getComponent(cc.Animation).play("landing");
        }
      }
      if (Uinfo.player_state == "jumpAttack") {
        Uinfo.player_state = "attack";
      }

      this.node.parent.y = 0;
      this.jumpCount = 0;
      this.jumpForce = 0;
    }
    // else if (this.node.parent.y == 0) {
    //   Uinfo.player_state = "stand";
    //   this.node.getComponent(cc.Animation).play("stand");
    // }
  }

  createDash() {
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x - 140 * this.node.scaleX;
      dash.y = this.node.y;
    }, 50);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x - 120 * this.node.scaleX;
      dash.y = this.node.y;
    }, 100);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x - 100 * this.node.scaleX;
      dash.y = this.node.y;
    }, 150);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x - 80 * this.node.scaleX;
      dash.y = this.node.y;
    }, 200);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x - 60 * this.node.scaleX;
      dash.y = this.node.y;
    }, 250);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x - 40 * this.node.scaleX;
      dash.y = this.node.y;
    }, 300);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x - 20 * this.node.scaleX;
      dash.y = this.node.y;
    }, 350);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x;
      dash.y = this.node.y;
    }, 400);
    setTimeout(() => {
      let dash: cc.Node = cc.instantiate(this.player_dash);
      this.node.parent.addChild(dash);
      dash.x = this.node.x;
      dash.y = this.node.y;
    }, 450);
    clearTimeout();
  }
  createBall() {
    let Ball = cc.instantiate(this.ball).getComponent(ball);
    this.node.parent.parent.addChild(Ball.node);
    let pos_x = this.node.parent.x;
    if (this.node.scaleX == 1) {
      Ball.node.setPosition(cc.v2(pos_x + 50, this.node.parent.y + 40));
    } else if (this.node.scaleX == -1) {
      Ball.node.setPosition(cc.v2(pos_x - 50, this.node.parent.y + 40));
    }
    Ball.dirction = this.node.scaleX;
    setTimeout(() => {
      Ball.node.destroy();
    }, 1500);
  }
  dash() {
    //冲刺
    this.node.parent.x += +this.dashForce * this.node.scaleX;
    //减速至停止
    if (this.dashForce >= 5) {
      this.dashForce -= 10;
    }
    if (this.dashForce <= 0) {
      this.dashForce = 0;
    }
  }
  update(dt) {
    if (Uinfo.player_state != "attack") {
      //因为player需要转身动画，摄像机也会跟着转，所以player节点不动
      //让父节点Player移动，方便摄像机跟随移动
      this.node.parent.x += this.speed * dt * this.direction;
    }
    if (this.hitForce != 0) {
      //不攻击时不调用
      this.hit();
    }
    if (this.dashForce != 0) {
      //不冲刺时不调用
      this.dash();
    }
    if (this.jumpCount <= 2 && this.jumpCount >= 1) {
      //不跳跃不调用
      this.jump(dt);
    }
  }
  //复活
  revive() {
    this.finish();
    cc.find("Canvas/UI_Camera/UILayer").active = true;
  }
  finish() {
    //攻击之后恢复到站立状态
    this.hitForce = 0;

    if (this.direction == 0) {
      Uinfo.player_state = "stand";
      this.node.getComponent(cc.Animation).play("stand_action");
    } else {
      Uinfo.player_state = "move";
      this.node.getComponent(cc.Animation).play("run_action");
    }
  }
}
