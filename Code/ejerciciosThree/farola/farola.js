import * as CSG from '../libs/three-bvh-csg.js';
import * as THREE from '../libs/three.module.js';

class Farola extends THREE.Object3D {
  constructor() {
    super();

    var material_negro = new THREE.MeshStandardMaterial({color: 0x000000, side: THREE.DoubleSide});
    var material_gris_oscuro = new THREE.MeshStandardMaterial({color: 0x444444,side: THREE.DoubleSide});

    //----------------------------GEOMETRIAS------------------------------------
    var guia = new THREE.BoxGeometry(0.02,0.75,0.02);

    var poste = new THREE.CylinderGeometry(0.025,0.05,1.4,20,20);
    var cabina = new THREE.CylinderGeometry(0.1,0.08,0.2,4,4);
    var cabinaRec = new THREE.CylinderGeometry(0.1,0.08,0.2,4,4);
    var cabinaRec2 = cabinaRec.clone();
    var topFarola = new THREE.CylinderGeometry(0.001,0.1,0.05,4,4);

   


    //-------------------------TRANSFORMACIONES---------------------------------
    //guia
    guia.translate(0.5,0.375,0);

    poste.translate(0,0.7,0);
    cabina.translate(0,1.48,0);
    cabinaRec.rotateY(Math.PI/4);
    cabinaRec.scale(1.2,0.8,0.8);
    cabinaRec.rotateY(Math.PI/4);
    cabinaRec.translate(0,1.48,0);

    cabinaRec2.rotateY(Math.PI/4);
    cabinaRec2.scale(1.2,0.8,0.8);
    cabinaRec2.rotateY(-Math.PI/4);
    cabinaRec2.translate(0,1.48,0);

    topFarola.translate(0,1.6,0);
  

    

    //----------------------OPERACIONES BOOLEANAS------------------------------
    //guia
    var guiaBrush = new CSG.Brush(guia,material_negro);

    var posteBrush = new CSG.Brush(poste,material_gris_oscuro);
    var cabinaBrush = new CSG.Brush(cabina,material_gris_oscuro);
    var cabinaRecBrush = new CSG.Brush(cabinaRec,material_gris_oscuro);
    var cabinaRec2Brush = new CSG.Brush(cabinaRec2,material_gris_oscuro);
    var topFarolaBrush = new CSG.Brush(topFarola,material_gris_oscuro);

    var evaluador = new CSG.Evaluator();
    

    var farola1 = evaluador.evaluate(guiaBrush, posteBrush, CSG.ADDITION);
    var cabina1 = evaluador.evaluate(cabinaBrush, cabinaRecBrush, CSG.SUBTRACTION);
    var cabina2 = evaluador.evaluate(cabina1, cabinaRec2Brush, CSG.SUBTRACTION);
    var cabina =  evaluador.evaluate(farola1, cabina2, CSG.ADDITION);
    var farola = evaluador.evaluate(cabina, topFarolaBrush, CSG.ADDITION);
    this.add(farola);
  }

  
  update() {
  }
}

export { Farola };
