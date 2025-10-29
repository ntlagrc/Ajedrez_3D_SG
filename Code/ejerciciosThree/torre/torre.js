import * as THREE from '../libs/three.module.js'
import { OBJLoader } from '../libs/OBJLoader.js'

 
class Torre extends THREE.Object3D {
  constructor() {
  super();
  this.modelLoaded = false; // bandera

  var material = new THREE.MeshStandardMaterial({ color: 0xff0000 });

  var objLoader = new OBJLoader();
  objLoader.load('./models/IronMan.obj',
    (object) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      object.scale.set(0.0033, 0.0033, 0.0033);
      object.rotation.x = -Math.PI / 2;
      this.add(object);

      this.userData.box = new THREE.Box3().setFromObject(this);
      this.modelLoaded = true;
    }
  );
}

update() {
  if (this.modelLoaded) {
    this.userData.box.setFromObject(this);
  }
}

}

export { Torre };


