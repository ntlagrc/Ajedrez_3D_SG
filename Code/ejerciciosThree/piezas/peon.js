import * as THREE from 'three'
import * as CSG from '../libs/three-bvh-csg.js'

class Peon extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    this.createGUI(gui,titleGui);

    //materiales
    var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide});
    var material_blanco = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
    var material_negro = new THREE.MeshStandardMaterial({color: 0x000000, side: THREE.DoubleSide});
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;


    //cabeza
    const segments = 30;
    var cabeza_shape = this.createShapeCabeza();
    const points_cabeza = cabeza_shape.getPoints();
    //araña
    var arania_shape = this.createShapeArania();
    this.options_estandar = {
      steps: 1,
      depth: 0.14,             
      bevelEnabled: false
    };
    //ojos 
    var ojos_shape = this.createShapeOjos();
    this.options_ojos = {
      steps: 1,
      depth: 0.05,             
      bevelEnabled: false
    };


    //----------------------------GEOMETRIAS------------------------------------
    var guia = new THREE.BoxGeometry(0.02,0.75,0.02);

    //cabeza
    var cabeza = new THREE.LatheGeometry(points_cabeza, segments);
    var cuello = new THREE.CylinderGeometry(0.015,0.02,0.035,20,20);
    var ojosN = new THREE.ExtrudeGeometry(ojos_shape, this.options_ojos);


    //cuerpo
    var cuerpoBase = new THREE.CylinderGeometry(0.08,0.05,0.25,20,20);
    var claviculas = new THREE.SphereGeometry(0.08,20,20);
    var arania = new THREE.ExtrudeGeometry(arania_shape, this.options_estandar);
    var pelvis = new THREE.CylinderGeometry(0.05,0.025,0.07,30,30);

    //brazos 
    var mano = new THREE.SphereGeometry(0.023,20,20);
    var antebrazo = new THREE.CylinderGeometry(0.015,0.02,0.15,20,20);
    var dedo = new THREE.CylinderGeometry(0.005,0.005,0.05,20,20);
    var codo = new THREE.SphereGeometry(0.021,20,20);
    var brazo = new THREE.CylinderGeometry(0.022,0.025,0.16,20,20);
    var hombro = new THREE.SphereGeometry(0.026,20,20);

    //piernas
    var muslo = new THREE.CylinderGeometry(0.033,0.025,0.18,30,30);
    var rodilla = new THREE.SphereGeometry(0.025,30,30);
    var pierna = new THREE.CylinderGeometry(0.025,0.015,0.17,30,30);
    var pie = new THREE.CylinderGeometry(0.015,0.015,0.03,30,30);



    //-------------------------TRANSFORMACIONES---------------------------------
    //guia
    guia.translate(0.5,0.375,0);

    //cabeza
    cabeza.scale(1.1,1,1.1);
    cuello.translate(0,0.01,0);
    ojosN.translate(0,-0.01,0);

    //cuerpo
    cuerpoBase.scale(1.2,1,0.7);
    claviculas.scale(1.2,0.5,0.7);
    claviculas.translate(0,0.125,0);
    arania.scale(0.8,0.9,1);
    arania.translate(0,0.0,-0.07);
    pelvis.scale(1.2,1,0.7);
    pelvis.translate(0,-0.13,-0.08);

    //brazos
    dedo.translate(0.015,0.03,0);
    mano.scale(1,1,0.5);

    //piernas
    pie.scale(1.5,1,3);
    pie.translate(0,-0.015,0.03);
    pierna.translate(0,0.08,0)
    

    //recorte Arania
    var recArania = cuerpoBase.clone();
    recArania.scale(1.1,1,1.1);
    //ojoIzq
    var ojoIzq = ojosN.clone();
    ojoIzq.scale(-1,1,1);

    //----------------------OPERACIONES BOOLEANAS------------------------------
    //guia
    var guiaBrush = new CSG.Brush(guia,material_rojo);
    
    //cabeza
    var cabezaBrush = new CSG.Brush(cabeza,material_rojo);
    var cuelloBrush = new CSG.Brush(cuello,material_rojo);
    var ojosNBrush = new CSG.Brush(ojosN,material_blanco);
    var ojosIzqBrush = new CSG.Brush(ojoIzq,material_blanco);
    //cuerpo
    var cuerpoBaseBrush = new CSG.Brush(cuerpoBase,material_rojo);
    var claviculasBrush = new CSG.Brush(claviculas,material_rojo);
    var araniaBrush = new CSG.Brush(arania,material_negro);
    var recAraniaBrush = new CSG.Brush(recArania,material_negro);
    var pelvisBrush = new CSG.Brush(pelvis,material_rojo);
    //brazos
    var manoDerBrush = new CSG.Brush(mano,material_rojo);
    var dedoBrush = new CSG.Brush(dedo,material_rojo);
    var antebrazoDerBrush = new CSG.Brush(antebrazo,material_rojo);
    var codoDerBrush = new CSG.Brush(codo,material_rojo);
    var brazoDerBrush = new CSG.Brush(brazo,material_rojo);
    var hombroDerBrush = new CSG.Brush(hombro,material_rojo);

    //piernas
    var pieBrush = new CSG.Brush(pie,material_rojo);
    var piernaBrush = new CSG.Brush(pierna,material_rojo);
    var rodillaBrush = new CSG.Brush(rodilla,material_rojo);
    var musloBrush = new CSG.Brush(muslo,material_rojo);
  
    

    //----------------------------------------------------------------------------------------------------
    var evaluador = new CSG.Evaluator();

    //cabeza
    var cabeza = evaluador.evaluate(cabezaBrush,cuelloBrush, CSG.ADDITION);
    var cabezaOjo1 = evaluador.evaluate(cabeza,ojosNBrush, CSG.ADDITION);
    var cabezaOjos = evaluador.evaluate(cabezaOjo1,ojosIzqBrush, CSG.ADDITION);
    cabezaOjos.geometry.translate(0,0.17,0);
    //cuerpo
    var cuerpoBase = evaluador.evaluate(cuerpoBaseBrush,claviculasBrush, CSG.ADDITION);
    var arania = evaluador.evaluate(araniaBrush,recAraniaBrush, CSG.INTERSECTION);
    arania.geometry.translate(0,0.05,0);
    var cuerpoArania = evaluador.evaluate(cuerpoBase,arania, CSG.ADDITION);
    cuerpoArania.geometry.rotateX(Math.PI / 10);
    cuerpoArania.geometry.translate(0,0.02,-0.05);
    
    var busto = evaluador.evaluate(cabezaOjos,cuerpoArania, CSG.ADDITION);
    var cuerpoSinBrazos = evaluador.evaluate(busto,pelvisBrush, CSG.ADDITION);

    //brazos
    //brazoDer
    var mano1 = evaluador.evaluate(manoDerBrush,dedoBrush, CSG.ADDITION);
    dedoBrush.geometry.translate(-0.03,0,0);
    var mano2 = evaluador.evaluate(mano1,dedoBrush, CSG.ADDITION);
    mano2.geometry.rotateX(Math.PI/9);
    mano2.geometry.translate(0,0.09,0);
    var antebrazoDer = evaluador.evaluate(mano2,antebrazoDerBrush, CSG.ADDITION);
    antebrazoDer.geometry.translate(0,0.075,0);
    var codoDer = evaluador.evaluate(antebrazoDer,codoDerBrush, CSG.ADDITION);
    codoDer.geometry.rotateX(-Math.PI/3)
    codoDer.geometry.translate(0,0.086,0);
    var brazoDer = evaluador.evaluate(codoDer,brazoDerBrush, CSG.ADDITION);
    brazoDer.geometry.rotateX(130*Math.PI/180);
    brazoDer.geometry.translate(0,-0.045,0.055);
    var hombro = evaluador.evaluate(brazoDer,hombroDerBrush, CSG.ADDITION);
    hombro.geometry.translate(-0.1,0.13,0);

    //brazoIzq 
    manoDerBrush.geometry.translate(0,0.09,0);
    var antebrazoIzq = evaluador.evaluate(manoDerBrush,antebrazoDerBrush, CSG.ADDITION);
    antebrazoIzq.geometry.translate(0,0.075,0);
    var codoIzq = evaluador.evaluate(antebrazoIzq,codoDerBrush, CSG.ADDITION);
    codoIzq.geometry.rotateX(-Math.PI/7)
    codoIzq.geometry.translate(0,0.086,0);
    var brazoIzq = evaluador.evaluate(codoIzq,brazoDerBrush, CSG.ADDITION);
    brazoIzq.geometry.rotateY(Math.PI/2);
    brazoIzq.geometry.rotateX(Math.PI);
    brazoIzq.geometry.rotateZ(Math.PI/7);
    brazoIzq.geometry.translate(0.03,-0.065,0);
    var hombroIzq = evaluador.evaluate(brazoIzq,hombroDerBrush, CSG.ADDITION);
    hombroIzq.geometry.translate(0.1,0.13,0);

    var brazos = evaluador.evaluate(hombro,hombroIzq, CSG.ADDITION);
    var cuerpoBrazos = evaluador.evaluate(cuerpoSinBrazos,brazos, CSG.ADDITION);
    cuerpoBrazos.geometry.translate(0,0.27,0);

    //piernas
    //piernaIzq
    var pierna = evaluador.evaluate(pieBrush,piernaBrush, CSG.ADDITION);
    pierna.geometry.translate(0,-0.172,0);
    var rodilla = evaluador.evaluate(pierna,rodillaBrush, CSG.ADDITION);
    var rodillaDer = rodilla.geometry.clone();
    rodilla.geometry.rotateX(110*Math.PI/180);
    rodilla.geometry.translate(0,-0.09,0);
    var muslo = evaluador.evaluate(rodilla,musloBrush, CSG.ADDITION);
    muslo.geometry.rotateX(-110*Math.PI/180);
    muslo.geometry.translate(0.04,0.17,0);
    //piernaDer
    var rodillaDerBrush = new CSG.Brush(rodillaDer,material_rojo);
    rodillaDerBrush.geometry.rotateX(145*Math.PI/180);
    rodillaDerBrush.geometry.translate(0,-0.1,0)
    var musloDer = evaluador.evaluate(musloBrush,rodillaDerBrush, CSG.ADDITION);
    musloDer.geometry.rotateX(-35*Math.PI/180);
    musloDer.geometry.translate(-0.04,0.1,-0.03);



    var piernas = evaluador.evaluate(muslo,musloDer, CSG.ADDITION);

    var peon = evaluador.evaluate(cuerpoBrazos,piernas, CSG.ADDITION);

    //añadimos a la escena
    this.add(peon);
  }

  createShapeCabeza(){
      var shape = new THREE.Shape();
      shape.moveTo(0, 0.02);
      shape.quadraticCurveTo(0.03, 0.015, 0.04, 0.07);
      shape.quadraticCurveTo(0.045, 0.10, 0.04, 0.12);
      shape.quadraticCurveTo(0.03, 0.14, 0, 0.14);
      shape.lineTo(0,0.02);
      return shape;
    }

  createShapeArania() {
  var shape = new THREE.Shape();

  // Lado derecho
  shape.moveTo(0, 0.02);
  shape.lineTo(0.01, 0.02);
  shape.lineTo(0.007, 0.03);
  shape.quadraticCurveTo(0.016, 0.026, 0.018, 0.018);
  shape.lineTo(0.025, 0.03);
  shape.lineTo(0.045, 0.03);
  shape.lineTo(0.035, 0.07);
  shape.quadraticCurveTo(0.05, 0.035, 0.05, 0.025);
  shape.lineTo(0.028, 0.025);
  shape.lineTo(0.023, 0.015);
  shape.lineTo(0.03, 0.02);
  shape.lineTo(0.06, 0.02);
  shape.lineTo(0.045, 0.07);
  shape.quadraticCurveTo(0.065, 0.035, 0.067, 0.015);
  shape.lineTo(0.035, 0.015);
  shape.lineTo(0.026, 0.008);
  shape.lineTo(0.045, 0.007);
  shape.lineTo(0.075, -0.015);
  shape.quadraticCurveTo(0.078, -0.0375, 0.065, -0.065);
  shape.lineTo(0.07, -0.018);
  shape.lineTo(0.045, 0);
  shape.lineTo(0.026, 0.001);
  shape.lineTo(0.05, -0.01);
  shape.quadraticCurveTo(0.057, -0.04, 0.045, -0.075);
  shape.lineTo(0.047, -0.015);
  shape.lineTo(0.015, 0);
  shape.quadraticCurveTo(0.02, -0.015, 0.004, -0.04);
  shape.lineTo(0, -0.035);

  // Lado izquierdo
  shape.lineTo(-0.004, -0.04);
  shape.quadraticCurveTo(-0.02, -0.015, -0.015, 0);
  shape.lineTo(-0.047, -0.015);
  shape.lineTo(-0.045, -0.075);
  shape.quadraticCurveTo(-0.057, -0.04, -0.05, -0.01);
  shape.lineTo(-0.026, 0.001);
  shape.lineTo(-0.045, 0);
  shape.lineTo(-0.07, -0.018);
  shape.lineTo(-0.065, -0.065);
  shape.quadraticCurveTo(-0.078, -0.0375, -0.075, -0.015);
  shape.lineTo(-0.045, 0.007);
  shape.lineTo(-0.026, 0.008);
  shape.lineTo(-0.035, 0.015);
  shape.lineTo(-0.067, 0.015);
  shape.quadraticCurveTo(-0.065, 0.035, -0.045, 0.07);
  shape.lineTo(-0.06, 0.02);
  shape.lineTo(-0.03, 0.02);
  shape.lineTo(-0.023, 0.015);
  shape.lineTo(-0.028, 0.025);
  shape.lineTo(-0.05, 0.025);
  shape.quadraticCurveTo(-0.05, 0.035, -0.035, 0.07);
  shape.lineTo(-0.045, 0.03);
  shape.lineTo(-0.025, 0.03);
  shape.lineTo(-0.018, 0.018);
  shape.quadraticCurveTo(-0.016, 0.026, -0.007, 0.03);
  shape.lineTo(-0.01, 0.02);
  shape.lineTo(0, 0.02); 

  return shape;
}

createShapeOjos() {
  var shape = new THREE.Shape();

  shape.moveTo(0.01, 0.1);
  shape.quadraticCurveTo(0.02, 0.11, 0.025, 0.11);
  shape.quadraticCurveTo(0.029, 0.112, 0.03, 0.114);
  shape.quadraticCurveTo(0.028, 0.09, 0.02, 0.09);
  shape.quadraticCurveTo(0.01, 0.09, 0.01, 0.1);

  return shape;
}


  rotateShape(aShape, angle, res = 6, center = new THREE.Vector2(0, 0)) {
      // Extraemos los puntos 2D del shape
      const points = aShape.extractPoints(res).shape;
    
      // Rotamos cada punto alrededor del centro
      points.forEach((p) => {
        p.rotateAround(center, angle);
      });
    
      // Creamos y devolvemos un nuevo shape con los puntos rotados
      return new THREE.Shape(points);
    } 
    
  createGUI (gui,titleGui) {
    
  }
  
  update () {
  }
}

export { Peon }

