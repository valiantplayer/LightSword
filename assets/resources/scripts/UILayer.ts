import { findNode, ui_add_click_listener } from "./Global/global";
import { Uinfo } from "./Global/Uinfo";
import player from "./Player/player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UILayer extends cc.Component {
  @property(cc.Node)
  btn_Left: cc.Node = null;

  @property(cc.Node)
  btn_Right: cc.Node = null;

  @property(cc.Node)
  btn_Attack: cc.Node = null;

  @property(cc.Node)
  btn_Dash: cc.Node = null;

  @property(cc.Node)
  btn_Jump: cc.Node = null;

  @property(cc.Node)
  btn_SpecialAttack: cc.Node = null;

  @property(cc.ProgressBar)
  player_dash: cc.ProgressBar = null;

  @property([cc.Node])
  hp_star: Array<cc.Node> = [];

  player_script;
  player_animation: cc.Animation;
  player_audioSource: cc.AudioSource;
  player_audio: cc.AudioSource;
  attckBtnClickNum: number = 0; //攻击按钮的点击次数
  Timer;
  onLoad(): void {
    this.create();
    this.player_dash.progress = 1;
    this.player_audio = this.player_script.node.getComponent(cc.AudioSource);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  create() {
    this.player_script = findNode(
      this.node.parent.parent,
      "player"
    ).getComponent(player);
    this.player_animation = this.player_script.node.getComponent(cc.Animation);
    this.player_audioSource = this.player_script.swordSounds.getComponent(
      cc.AudioSource
    );
    for (let i = this.hp_star.length - 1; i >= 0; i--) {
      this.hp_star[i].getChildByName("hp_empty").active = false;
    }
    setInterval(() => {
      if (this.player_dash.progress >= 0 && this.player_dash.progress <= 1) {
        this.player_dash.progress += 0.2;
      }
    }, 3000);
  }
  start() {
    Uinfo.player_dirction = "Left";
    Uinfo.isPress = false;
    this.onClick(this.btn_Left, 1);
    this.onClick(this.btn_Right, -1);

    ui_add_click_listener(this.btn_Attack, () => {
      this.attckBtnClickNum++;
      //播放攻击音效
      this.player_audioSource.play();
      //状态切换
      if (Uinfo.player_state == "jump") {
        Uinfo.player_state = "jumpAttack";
      }
      //非跳跃非攻击状态，切换到普通攻击状态
      if (Uinfo.player_state != "jump" && Uinfo.player_state != "jumpAttack") {
        Uinfo.player_state = "attack";
      }

      if (this.attckBtnClickNum == 1) {
        //攻击次数
        this.player_animation.play("atk_a");
        //攻击时往前倾，增加打击感
        this.player_script.hitForce = 4;
      } else if (this.attckBtnClickNum == 2) {
        this.attckBtnClickNum = 0;
        this.player_animation.play("atk_b");
        //攻击时往前倾，增加打击感
        this.player_script.hitForce = 6;
      }
    });
    ui_add_click_listener(this.btn_Dash, () => {
      this.player_dash.progress -= 0.2;
      if (this.player_dash.progress <= 0) {
        this.player_dash.progress = 0;
        return;
      }
      this.player_script.dashForce = 50;
      this.player_script.jumpForce = 0;
      Uinfo.player_state = "dash";
      //冲刺特效
      this.player_script.createDash();
      this.node.getComponent(cc.AudioSource).play();
      this.player_animation.play("dash");
      setTimeout(() => {
        if (this.player_script.isRead == 1) {
          Uinfo.player_state = "stand";
          this.player_script.isDash = false;
          if (this.player_script.direction == 0) {
            this.player_animation.play("stand_action");
          } else {
            if (this.player_script.jumpCount == 0) {
              this.player_animation.play("run_action");
            }
          }
        }
        if (this.player_script.isRead == 0) {
          if (Uinfo.player_state != "dashAttack") {
            Uinfo.player_state = "stand";
            if (this.player_script.direction == 0) {
              this.player_animation.play("stand_action");
            } else {
              if (this.player_script.jumpCount == 0) {
                this.player_animation.play("run_action");
              }
            }
          }
        }

        if (this.player_script.node.parent.y > 0) {
          this.player_script.isFall = false;
          if (Uinfo.player_state != "attack") {
            Uinfo.player_state = "jump";
          }
        }
        this.player_script.dashForce = 0;
        if (Uinfo.player_state != "jump") {
          this.player_script.isDash = false;
        }
      }, 500);

      this.player_script.isDash = false;
    });
    ui_add_click_listener(this.btn_Jump, () => {
      if (this.player_script.jumpCount < 2) {
        Uinfo.player_state = "jump";
        this.player_script.jumpForce = 500;
        this.player_script.jumpCount++;
        this.player_script.isFall = false;
        this.player_animation.play("jump");
      }
    });
    ui_add_click_listener(this.btn_SpecialAttack, () => {
      if (this.player_script.jumpCount == 2) {
        if (Uinfo.player_state != "dash") Uinfo.player_state = "dashAttack";
        this.player_animation.play("rotating");
        this.player_script.isRead = 0;
        setTimeout(() => {
          if (Uinfo.player_state == "dashAttack") {
            this.player_script.dashForce = 0;
            this.player_script.isDash = false;
            Uinfo.player_state = "jumpAttack";
            this.player_animation.play("atk_b");
          }
        }, 500);
      }
      if (Uinfo.player_state == "stand") {
        Uinfo.player_state = "special_attack";
        this.player_animation.play("special_attack");
        this.player_script.createBall();
        setTimeout(() => {
          this.player_animation.play("stand_action");
          Uinfo.player_state = "stand";
        }, 500);
      }
    });
  }
  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        Uinfo.isPress = true;

        if (
          this.player_script.direction == 0 &&
          Uinfo.player_state == "stand"
        ) {
          if (this.player_script.jumpCount == 0) {
            this.player_animation.play("run_action");
          }
        }
        this.player_script.direction = -1;
        this.player_script.node.scaleX = -1;
        break;

      case cc.macro.KEY.d:
        Uinfo.isPress = true;

        if (
          this.player_script.direction == 0 &&
          Uinfo.player_state == "stand"
        ) {
          if (this.player_script.jumpCount == 0) {
            this.player_animation.play("run_action");
          }
        }
        this.player_script.direction = 1;
        this.player_script.node.scaleX = 1;
        break;
    }
  }
  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
        Uinfo.isPress = false;
        this.onStand();
        break;
      case cc.macro.KEY.d:
        Uinfo.isPress = false;
        this.onStand();
        break;
    }
  }
  soundRun() {
    this.player_audio.play();
  }
  onMove(dir) {
    //移动
    if (Uinfo.player_state == "attack") return;

    if (this.player_script) {
      this.player_animation.play("run_action");
      this.player_script.direction = dir;
      this.player_script.node.scaleX = dir;
      if (dir == 1) {
        Uinfo.player_dirction = "Left";
      } else if (dir == -1) {
        Uinfo.player_dirction = "Right";
      }
    }
  }
  onStand() {
    //站立
    // if (Uinfo.player_state == "attack") return;
    // Uinfo.player_state = "stand";
    if (this.player_script) {
      this.player_script.direction = 0;
      this.player_animation.play("stand_action");
    }
  }
  onClick(btn: cc.Node, dir: number) {
    btn.on(cc.Node.EventType.TOUCH_START, () => {
      //移动
      console.log(2);
      this.onMove(dir);
    });
    btn.on(cc.Node.EventType.TOUCH_END, () => {
      //站立
      this.onStand();
    });
    btn.on(cc.Node.EventType.TOUCH_CANCEL, () => {
      //站立
      this.onStand();
    });
  }
  protected onDestroy(): void {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }
}
