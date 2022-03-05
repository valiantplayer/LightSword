const { ccclass, property } = cc._decorator;
import { Uinfo } from "./Global/Uinfo";
import player from "./Player/player";
@ccclass
export default class platform extends cc.Component {
  player_script;
  player_animation;
  protected start(): void {
    let Player: cc.Node = cc.find("Canvas/allPlayer/Player/player");
    this.player_script = Player.getComponent(player);
    this.player_animation = Player.getComponent(cc.Animation);
  }

  onBeginContact() {
    this.player_script.isRead = 1;
    if (Uinfo.player_state == "jump" || Uinfo.player_state == "jumpAttack") {
      this.player_script.jumpForce = 0;
      this.player_script.jumpCount = 0;
      this.player_script.isFall = false;
      if (this.player_script.dirction == 0) {
        this.player_animation.play("landing");
      } else {
        this.player_animation.play("run_action");
      }
      Uinfo.player_state = "stand";
    }
    this.player_script.isDash = false;
  }

  onEndContact() {
    if (this.player_script.isRead == 1) {
      if (Uinfo.player_state != "dash") {
        Uinfo.player_state = "jump";
        this.player_script.isRead = 0;
      } else if (Uinfo.player_state == "dash") {
        Uinfo.player_state = "dashAttack";
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
    }
  }
  protected update(dt: number): void {
    if (Uinfo.player_state == "dashAttack") {
      this.player_script.node.parent.x += this.player_script.node.scaleX * 1.5;
      if (this.player_script.node.parent.y > 0.6) {
        this.player_script.node.parent.y -= 0.6;
      }
    }
  }
}
