export function urlOpen(url:string,Node:cc.Node, callback?:Function) {
  cc.resources.load("prefab/ui/"+url, (err,prefab: cc.Prefab) => {
    if(prefab){
        let node:cc.Node=cc.instantiate(prefab);
        if(node){
          Node.addChild(node)
        }
    }else{
      console.log(err+"name load error");
    }
  });
}
