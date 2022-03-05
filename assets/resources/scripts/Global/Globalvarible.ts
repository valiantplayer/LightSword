export namespace Global {
  // 计时器工具人
  class ScheduleTarget {}
  let target: ScheduleTarget;

  // 全局计时器
  let scheduler: cc.Scheduler;

  export let schedule = (foo: Function, time: number) => {
    if (!target) {
      target = new ScheduleTarget();
      scheduler = cc.director.getScheduler();
      scheduler.enableForTarget(target);
    }
    scheduler.schedule(foo, target, time);
    return foo;
  };
  export let scheduleOnce = (foo: Function, time: number) => {
    if (!target) {
      target = new ScheduleTarget();
      scheduler = cc.director.getScheduler();
      scheduler.enableForTarget(target);
    }
    let func = () => {
      foo();
      unschedule(func);
    };
    scheduler.schedule(func, target, time);
    return func;
  };

  export let unschedule = (foo: Function) => {
    scheduler.unschedule(foo, target);
  };

  export let unAllschedule = () => {
    if (target) {
      scheduler.unscheduleAllForTarget(target);
    }
  };

  /** 获取系统时间 (单位: 秒) */
  export function getSystemTime() {
    return socket.gettime();
  }

  export const socket = {
    gettime() {
      return Date.now() / 1000;
    },
  };
  export let scheduleNodeWithTime = (
    node,
    listener,
    interval,
    time,
    onComplete
  ) => {
    let i = time;
    let callback = () => {
      i = i - 1;
      listener(i);
      if (i <= 0) {
        if (onComplete != null) {
          onComplete();
        }
      } else {
        cc.tween(node)
          .delay(interval)
          .call(() => {
            callback();
          })
          .start();
      }
    };
    cc.tween(node)
      .delay(interval)
      .call(() => {
        callback();
      })
      .start();
  };

  export let scheduleNode = (
    node: cc.Node,
    listener: Function,
    interval: number
  ) => {
    let delay = cc.delayTime(interval);
    let sequence = cc.sequence(delay, cc.callFunc(listener));
    let rep = cc.repeatForever(sequence);
    node.runAction(rep);
    return rep;
  };

  export let unscheduleNode = (node: cc.Node, action: cc.ActionInterval) => {
    node.stopAction(action);
  };

  export let scheduleNodeTween = (
    node: cc.Node,
    listener: Function,
    interval: number
  ) => {
    let tweenFun = () => {
      cc.tween(node).delay(interval).call(listener).call(tweenFun).start();
    };
    tweenFun();
    return node;
  };

  export let unscheduleNodeTween = (node: cc.Node) => {
    cc.Tween.stopAllByTarget(node);
  };
}
