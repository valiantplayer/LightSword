const { ccclass, property } = cc._decorator;

@ccclass
export default class hurtBox extends cc.Component {
  @property(cc.Material)
  Material: cc.Material = null;
  @property(cc.Material)
  Material_before: cc.Material = null;
  @property(cc.Prefab)
  Hit_Effect: cc.Prefab = null;

  Timer;
  start() {}

  onCollisionEnter(other, self) {
    let hit_effect: cc.Node = cc.instantiate(this.Hit_Effect);
    this.node.addChild(hit_effect);
    // hit_effect.setPosition(cc.v2(this.node.x, this.node.y));
    this.node.getComponent(cc.Sprite).setMaterial(0, this.Material);
    // this.node.getComponent(cc.Sprite).setMaterial(0, this.Material_before);
    this.node.getComponent(cc.AudioSource).play();
  }
  onCollisionExit(other, self) {
    this.node.getComponent(cc.Sprite).setMaterial(0, this.Material_before);
  }
}
