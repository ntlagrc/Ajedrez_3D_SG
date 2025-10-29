import * as THREE from 'three';
import { MTLLoader } from '../libs/MTLLoader.js';
import { OBJLoader } from '../libs/OBJLoader.js';

class Torre extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();
    this.createGUI(gui, titleGui);

    // Ruta a los ficheros de modelo
    const mtlPath = './models/IronMan.mtl';
    const objPath = './models/IronMan.obj';

    // Cargadores
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    // Carga de materiales primero
    mtlLoader.load(
      mtlPath,
      (materials) => {
        materials.preload();
        // Asignar materiales al loader de objetos
        objLoader.setMaterials(materials);
        // Carga del modelo OBJ
        objLoader.load(
          objPath,
          (object) => {
            // Opcional: escalar o centrar el modelo
            object.scale.set(0.0033, 0.0033, 0.0033);
            object.position.set(0, 0, 0);
            object.rotateX(-Math.PI / 2);
            // Añadir el modelo a este objeto
            this.add(object);
          },
          // onProgress
          (xhr) => {
            console.log(`IronMan.obj: ${ (xhr.loaded / xhr.total * 100).toFixed(2) }% cargado`);
          },
          // onError
          (err) => {
            console.error('Error al cargar IronMan.obj', err);
          }
        );
      },
      // onProgress de MTL
      (xhr) => {
        console.log(`IronMan.mtl: ${ (xhr.loaded / xhr.total * 100).toFixed(2) }% cargado`);
      },
      // onError de MTL
      (err) => {
        console.error('Error al cargar IronMan.mtl', err);
      }
    );
  }

  createGUI(gui, titleGui) {
    // Definir controles de GUI si es necesario
  }

  update() {
    // Lógica de animación o actualización por frame
  }
}

export { Torre };

