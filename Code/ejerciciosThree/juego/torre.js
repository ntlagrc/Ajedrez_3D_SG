import { inBounds, isEmpty, isAlly, isEnemy } from './movimientos.js';
import * as THREE from '../libs/three.module.js'
import { OBJLoader } from '../libs/OBJLoader.js'

 
class Torre extends THREE.Object3D {
  constructor(material, onModelLoad = null) {
    super();
    this.modelLoaded = false;

    var objLoader = new OBJLoader();
    objLoader.load('./models/IronMan.obj',
      (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
            child.userData.piece = this;
          }
        });
        object.scale.set(0.0033, 0.0033, 0.0033);
        object.rotation.x = -Math.PI / 2;
        this.add(object);

        this.userData.box = new THREE.Box3().setFromObject(this);
        this.modelLoaded = true;

        if (onModelLoad) onModelLoad(this);
      }
    );
  }

getValidMoves(boardState) {
    const moves = [];
    const dirs = [ [1,0],[-1,0],[0,1],[0,-1] ];
    for (const [dr,dc] of dirs) {
      let r = this.row + dr, c = this.col + dc;
      while (inBounds(r,c)) {
        if (isEmpty(boardState,r,c)) {
          moves.push({row:r, col:c});
        } else {
          if (isEnemy(boardState,r,c,this.color))
            moves.push({row:r, col:c});
          break;
        }
        r += dr; c += dc;
      }
    }
    return moves;
  }

update() {
  if (this.modelLoaded) {
    this.userData.box.setFromObject(this);
  }
}

}

export { Torre };


