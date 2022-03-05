import { Global } from "./Globalvarible";

class _limit_buttons {
  sid: any;
  limit_time_default = 0.2;
  interval = 0.1;
  limit_map: { _button: any; curtime: number; limit_time: number }[] = [];
  constructor() {}

  _update() {
    let new_map = [];
    for (let v of this.limit_map) {
      if (cc.isValid(v._button)) {
        v.curtime += this.interval;
        if (v.curtime <= v.limit_time) {
          new_map.push(v);
        }
      }
    }
    this.limit_map = new_map;

    if (this.limit_map.length == 0) {
      this.stopSchedule();
    }
  }

  isCanClick(btn) {
    for (let v of this.limit_map) {
      if (cc.isValid(v._button)) {
        if (v._button == btn) {
          return false;
        }
      }
    }
    return true;
  }

  addLimitButton(btn, limit_time?: number) {
    let _limit_time = limit_time || this.limit_time_default;
    this.limit_map.push({ _button: btn, curtime: 0, limit_time: _limit_time });
    this.startSchedule();
  }

  stopSchedule() {
    // if (!this.Global) this.Global = require('../GlobalVariable').Global;
    if (this.sid) {
      Global.unschedule(this.sid);
      this.sid = null;
    }
  }

  startSchedule() {
    // if (!this.Global) this.Global = require('../GlobalVariable').Global;
    this.stopSchedule();
    this.sid = () => {
      this._update();
    };
    Global.schedule(this.sid, this.interval);
  }
}

export const limit_buttons = new _limit_buttons();

// 为ui添加点击事件（带音效）
export function ui_add_click_listener(
  node: cc.Node,
  func: Function,
  limit_time?: number
) {
  if (!cc.isValid(node)) {
    return;
  }

  if (node["_has_add_click_listener"] == true) {
    node.off(cc.Node.EventType.TOUCH_START);
    node.off(cc.Node.EventType.TOUCH_END);

    cc.log("重复注册事件");
  }
  node["_has_add_click_listener"] = true;

  // node.on(cc.Node.EventType.TOUCH_START, () => {
  //     if (!limit_buttons.SoundPlayer) {
  //         limit_buttons.SoundPlayer = require('./constants-new').SoundPlayer;
  //         limit_buttons.SoundType = require('../game/utils/SoundPlay').SoundType;
  //     }
  //     const { SoundPlayer, SoundType } = limit_buttons;

  //     // 没有默认音效则去查找按钮是否有指定音效
  //     if (!soundType) {
  //         const name = node.name;
  //         soundType = SoundType[name] ? name as SoundType : soundType;
  //     }
  //     if (soundType) {
  //         soundType = soundType || SoundType.CLICK;
  //         SoundPlayer.play(soundType);
  //     }
  // })

  node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
    if (!limit_buttons.isCanClick(event.target)) {
      return;
    }
    limit_buttons.addLimitButton(event.target, limit_time);
    func && func(event);
  });

  let com_button = node.getComponent(cc.Button);
  if (com_button && com_button.transition == cc.Button.Transition.SPRITE) {
    com_button.pressedSprite = null;
  }
}

//在父节点遍历查找子节点
export function findNode(parent: cc.Node, name: string): cc.Node {
  if (parent.name == name) {
    return parent;
  }
  for (const child of parent.children) {
    if (child.name === name) {
      return child;
    } else {
      let temp = findNode(child, name);
      if (temp) return temp;
    }
  }
  return undefined;
}
export function loadTexture(item: cc.Sprite, path: string) {
  cc.resources.load(
    path,
    cc.SpriteFrame,
    null,
    (err, spriteFrame: cc.SpriteFrame) => {
      if (item.isValid) {
        item.spriteFrame = spriteFrame;
      }
    }
  );
}
