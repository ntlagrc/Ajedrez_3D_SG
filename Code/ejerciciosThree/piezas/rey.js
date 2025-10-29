import * as THREE from 'three'
import * as CSG from '../libs/three-bvh-csg.js'

class Rey  extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    this.createGUI(gui,titleGui);

    //materiales
    var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide});
    var material_gris = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
    var material_amarillo = new THREE.MeshStandardMaterial({color: 0xFFFF00, side: THREE.DoubleSide});
    var material_azul = new THREE.MeshStandardMaterial({color: 0x0000FF, side: THREE.DoubleSide});
    var material_gris_oscuro = new THREE.MeshStandardMaterial({color: 0x444444,side: THREE.DoubleSide});
    var material_negro = new THREE.MeshStandardMaterial({color: 0x000000, side: THREE.DoubleSide});

    var material_piel = new THREE.MeshStandardMaterial({
          color: 0xF1C6A4,  
          side: THREE.DoubleSide,
          roughness: 0.5,   
          metalness: 0.1,  
          emissive: 0x000000,  
      });
    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;


    //cabeza
    const segments = 30;
    var cabeza_shape = this.createShapeCabeza();
    const points_cabeza = cabeza_shape.getPoints();
    var pelo_shape = this.createShapePelo();
    const points_pelo = pelo_shape.getPoints();
    const path_mechon = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.01, 0.07, 0.015),
          new THREE.Vector3(0.01, 0.075, 0.015),
          new THREE.Vector3(0.03, 0.09, 0.015),
          new THREE.Vector3(0.04, 0.085, 0.01),
          new THREE.Vector3(0.06, 0.045, 0),
          new THREE.Vector3(0.05, -0.015, 0),
          new THREE.Vector3(0.04, -0.045, -0.01),
        ]);
    this.options_estandar = {
      steps: 1,
      depth: 0.2,             
      bevelEnabled: false
    };

    //cuerpo
    var capa = this.createShapeCapa();
    const points_capa = capa.getPoints().reverse();

    //mascara
    var mascara_shape = this.createShapeMascara();
    


    //----------------------------GEOMETRIAS------------------------------------
    var guia = new THREE.BoxGeometry(0.02,0.75,0.02);
;
    //cabeza
    var cabeza = new THREE.LatheGeometry(points_cabeza, segments);
    var pelo = new THREE.LatheGeometry(points_pelo, segments);
    var recPelo = new THREE.SphereGeometry(0.5,40,40);
    var recPelo2 = new THREE.BoxGeometry(0.2,0.2,0.2);
    var mechonPelo = new THREE.TubeGeometry(path_mechon, 100, 0.014, 8, false);
    var cuello = new THREE.CylinderGeometry(0.015,0.02,0.035,20,20);
    //mascara
    var mascara = new THREE.ExtrudeGeometry(mascara_shape, this.options_estandar);
    var cilMascaraExt = new THREE.CylinderGeometry(0.075,0.075,0.2,30,30);
    var cilMascaraInt = new THREE.CylinderGeometry(0.06,0.06,0.2,30,30);
    var cuernoBase = new THREE.CylinderGeometry(0.06,0.06,0.015,30,30);
    var cuernoRecorte = new THREE.CylinderGeometry(0.055,0.055,0.02,30,30);
    //cuerpo
    var cuerpoBase = new THREE.CylinderGeometry(0.1,0.07,0.3,20,20);
    var claviculas = new THREE.SphereGeometry(0.1,30,30);
    //capa
    var capaExt = new THREE.LatheGeometry(points_capa, segments);
    var capaInt = capaExt.clone();
    var recorteCapa = new THREE.BoxGeometry(0.04,0.3,0.2);
    var recCapaDelante = capaExt.clone();
    var cinturon = new THREE.CylinderGeometry(0.08,0.08,0.04,30,30);
    //piernas 
    var pelvis = new THREE.CylinderGeometry(0.07,0.02,0.08,30,30);
    var piernaEntera = new THREE.CylinderGeometry(0.05,0.025,0.41,30,30);
    var pie = new THREE.CylinderGeometry(0.02,0.02,0.03,30,30);

    //brazo Der
    var manoDer = new THREE.SphereGeometry(0.025,30,30);
    var antebrazoDer = new THREE.CylinderGeometry(0.027,0.02,0.16,30,30);
    var codoDer = new THREE.SphereGeometry(0.025,30,30);
    var brazoDer = new THREE.CylinderGeometry(0.02,0.023,0.15,30,30);
    //brazo Izquierdo
    var manoIzq = manoDer.clone();
    var brazoIzq = new THREE.CylinderGeometry(0.022,0.02,0.3,30,30);

    //cetro
    var mango = new THREE.CylinderGeometry(0.01,0.01,0.6,20,20);
    var baseCetro = new THREE.CylinderGeometry(0.07,0.07,0.01,20,20);
    var recCetro = new THREE.BoxGeometry(0.05,0.1,0.03);
    var piedra = new THREE.SphereGeometry(0.02,20,20);



    //-------------------------TRANSFORMACIONES---------------------------------
    //guia
    guia.translate(0.5,0.375,0);

    //cabeza
    cabeza.scale(1,1,1);
    recPelo.translate(0,0.35,-0.35);
    recPelo2.translate(0,0.06,0.105);
    mechonPelo.translate(0,0.06,0);
    cuello.translate(0,0.01,0);
    //mascara
    cilMascaraExt.translate(0,0.095,-0.03);
    cilMascaraInt.translate(0,0.095,-0.03);
    cuernoBase.rotateZ(Math.PI/2);
    cuernoRecorte.rotateZ(Math.PI/2);
    cuernoRecorte.translate(0,0,-0.01);
    //cuerpo
    cuerpoBase.scale(1.2,1,0.7);
    claviculas.scale(1.2,0.5,0.7);
    claviculas.translate(0,0.15,0);
    //capa
    capaInt.scale(0.9,1,0.9);
    capaInt.translate(0,-0.03,0);
    recorteCapa.translate(0,-0.3,0);
    recorteCapa.translate(0,0.2,-0.1);
    recCapaDelante.scale(0.9,1,0.9);
    recCapaDelante.translate(0,-0.01,0.1);

    cinturon.scale(1.2,1,0.7);
    cinturon.translate(0,0.02,0);
    
    //piernas
    pelvis.translate(0,-0.04,0);
    pelvis.scale(1.2,1,0.7);
    pie.scale(1.5,1,3);
    pie.translate(0,0,0.03);
    piernaEntera.translate(0,0.215,0);

    //brazos
    manoDer.translate(0,-0.07,0);
    manoIzq.translate(0,-0.14,0)
    
    //cetro
    mango.translate(0,0.3,0);
    baseCetro.rotateZ(Math.PI/2);
    baseCetro.scale(1,1.4,0.8);
    baseCetro.translate(0,0.65,0);
    recCetro.translate(0,0.7,0);
    piedra.translate(0,0.65,0);


    //----------------------OPERACIONES BOOLEANAS------------------------------
    //guia
    var guiaBrush = new CSG.Brush(guia,material_rojo);
    
    //cabeza
    var cabezaBrush = new CSG.Brush(cabeza,material_piel);
    var peloBrush = new CSG.Brush(pelo,material_negro);
    var recPeloBrush = new CSG.Brush(recPelo,material_negro);
    var recPelo2Brush = new CSG.Brush(recPelo2,material_negro);
    var mechonPeloBrush = new CSG.Brush(mechonPelo,material_negro);
    var cuelloBrush = new CSG.Brush(cuello,material_piel)
    //mascara
    var mascaraBrush = new CSG.Brush(mascara,material_amarillo);
    var cilMascaraIntBrush = new CSG.Brush(cilMascaraInt,material_amarillo);
    var cilMascaraExtBrush = new CSG.Brush(cilMascaraExt,material_amarillo);
    var cuernoBaseBrush = new CSG.Brush(cuernoBase,material_amarillo);
    var cuernoRecorteBrush = new CSG.Brush(cuernoRecorte,material_amarillo);

    //cuerpo
    var cuerpoBaseBrush = new CSG.Brush(cuerpoBase,material_gris_oscuro);
    var claviculasBrush = new CSG.Brush(claviculas,material_gris_oscuro);
    var capaExtBrush =  new CSG.Brush(capaExt,material_gris);
    var capaIntBrush =  new CSG.Brush(capaInt,material_gris_oscuro);
    var recorteCapaBrush = new CSG.Brush(recorteCapa,material_gris_oscuro);
    var recCapaDelanteBrush = new CSG.Brush(recCapaDelante,material_gris_oscuro);
    var cinturonBrush = new CSG.Brush(cinturon,material_negro);

    //piernas
    var pelvisBrush = new CSG.Brush(pelvis,material_gris_oscuro);
    var piernaEnteraBrush = new CSG.Brush(piernaEntera,material_gris_oscuro);
    var pieBrush = new CSG.Brush(pie,material_gris_oscuro);

    //brazos
    var manoDerBrush = new CSG.Brush(manoDer,material_gris_oscuro);
    var antebrazoDerBrush = new CSG.Brush(antebrazoDer,material_gris_oscuro);
    var codoDerBrush = new CSG.Brush(codoDer,material_gris_oscuro);
    var brazoDerBrush = new CSG.Brush(brazoDer,material_gris_oscuro);
    //brazo Izquierdo
    var manoIzqBrush = new CSG.Brush(manoIzq,material_gris_oscuro);
    var brazoIzqBrush = new CSG.Brush(brazoIzq,material_gris_oscuro);

    //cetro
    var mangoBrush = new CSG.Brush(mango,material_amarillo);
    var baseCetroBrush = new CSG.Brush(baseCetro,material_amarillo);
    var recCetroBrush = new CSG.Brush(recCetro,material_amarillo);
    var piedraBrush = new CSG.Brush(piedra,material_azul);



    //copia mechon
    var mechonPeloDer = mechonPeloBrush.geometry.clone();
    mechonPeloDer.scale(-1,1,1);
    mechonPeloDer.computeVertexNormals();
    var mechonPeloDerBrush = new CSG.Brush(mechonPeloDer,material_negro);
    
    

    //----------------------------------------------------------------------------------------------------
    var evaluador = new CSG.Evaluator();

    //mascara
    var cuerno = evaluador.evaluate(cuernoBaseBrush,cuernoRecorteBrush, CSG.SUBTRACTION);
    cuerno.geometry.translate(0.028,0.17,0.01);
    var mascaraInt = evaluador.evaluate(mascaraBrush,cilMascaraIntBrush, CSG.SUBTRACTION);
    var mascara1 = evaluador.evaluate(mascaraInt,cilMascaraExtBrush, CSG.INTERSECTION);
    var mascara2 = evaluador.evaluate(mascara1,cuerno, CSG.ADDITION);
    cuerno.geometry.translate(-0.056,0,0);
    var mascara = evaluador.evaluate(mascara2,cuerno, CSG.ADDITION);
    //cabeza
    var cabezaCuello = evaluador.evaluate(cuelloBrush,cabezaBrush, CSG.ADDITION);
    var peloRec1 = evaluador.evaluate(peloBrush,recPeloBrush, CSG.INTERSECTION);
    var peloRec2 = evaluador.evaluate(peloRec1,recPelo2Brush, CSG.SUBTRACTION);
    var mechones = evaluador.evaluate(mechonPeloDerBrush,mechonPeloBrush, CSG.ADDITION);
    var pelo = evaluador.evaluate(peloRec2,mechones, CSG.ADDITION);
    var cabeza = evaluador.evaluate(cabezaCuello,pelo, CSG.ADDITION);
    var cabezaMascara = evaluador.evaluate(cabeza,mascara, CSG.ADDITION);
    cabezaMascara.geometry.translate(0,0.007,0);
    cabezaMascara.geometry.translate(0,0.2,0);
    var claviculas = evaluador.evaluate(cabezaMascara,claviculasBrush, CSG.ADDITION);

    //cuerpo
    var cuerpoBase = evaluador.evaluate(cuerpoBaseBrush,claviculasBrush, CSG.ADDITION);
    var cuerpoArriba = evaluador.evaluate(claviculas,cuerpoBase, CSG.ADDITION);
    cuerpoArriba.geometry.translate(0,0.15,0);
    var cintura = evaluador.evaluate(cuerpoArriba,cinturonBrush, CSG.ADDITION);
    var pelvis = evaluador.evaluate(cintura,pelvisBrush, CSG.ADDITION);
    pelvis.geometry.translate(0,0.42,0);

    //piernas
    var pie = evaluador.evaluate(piernaEnteraBrush, pieBrush,CSG.ADDITION);
    pie.geometry.translate(-0.045,0,0);
    var piernaIzq = pie.geometry.clone();
    piernaIzq.scale(-1,1,1);
    piernaIzq.computeVertexNormals();
    var piernaIzqBrush = new CSG.Brush(piernaIzq,material_gris_oscuro);
    var piernas = evaluador.evaluate(pie,piernaIzqBrush, CSG.ADDITION);
    
    var cuerpoSinBrazos = evaluador.evaluate(pelvis,piernas, CSG.ADDITION);
    cuerpoSinBrazos.geometry.scale(0.75,0.82,0.85);
    
    //capa
    var capa1 = evaluador.evaluate(capaExtBrush,capaIntBrush, CSG.SUBTRACTION);
    var capa2 = evaluador.evaluate(capa1,recorteCapaBrush, CSG.SUBTRACTION);
    var capa = evaluador.evaluate(capa2,recCapaDelanteBrush, CSG.SUBTRACTION);
    capa.geometry.translate(0,0.26,0);
    var cuerpoCapa = evaluador.evaluate(cuerpoSinBrazos,capa, CSG.ADDITION);

    //brazos
    //brazoIzq
    var brazoIzq = evaluador.evaluate(brazoIzqBrush,manoIzqBrush, CSG.ADDITION);
    brazoIzq.geometry.translate(0.075,0.45,0);
    //brazoDer
    var antebrazoDer = evaluador.evaluate(manoDerBrush,brazoDerBrush, CSG.ADDITION);
    antebrazoDer.geometry.translate(0,-0.08,0);
    var codoDer = evaluador.evaluate(antebrazoDer,codoDerBrush, CSG.ADDITION);
    codoDer.geometry.rotateX(-Math.PI/3);
    codoDer.geometry.translate(0,-0.09,0);
    var brazoDer = evaluador.evaluate(codoDer,brazoDerBrush, CSG.ADDITION);
    brazoDer.geometry.translate(-0.08,0.5,0);

    var brazos = evaluador.evaluate(brazoIzq,brazoDer, CSG.ADDITION);
    var cuerpo = evaluador.evaluate(cuerpoCapa,brazos, CSG.ADDITION);

    //cetro 
    var cetro1 = evaluador.evaluate(mangoBrush,baseCetroBrush, CSG.ADDITION);
    var cetro2 = evaluador.evaluate(cetro1,recCetroBrush, CSG.SUBTRACTION);
    var cetro3 = evaluador.evaluate(cetro2,piedraBrush, CSG.ADDITION);
    cetro3.geometry.scale(1,1.3,1);
    cetro3.geometry.translate(-0.08,0,0.14);


    var rey = evaluador.evaluate(cetro3,cuerpo, CSG.ADDITION);


    //añadimos a la escena
    this.add(rey);
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

  createShapePelo(){
    var shape = new THREE.Shape();
    shape.moveTo(0, 0.045);
    shape.quadraticCurveTo(0.03, 0.045, 0.06, -0.035);
    shape.quadraticCurveTo(0.062, -0.045, 0.075, -0.045);
    shape.quadraticCurveTo(0.05, -0.005, 0.065, 0.045);
    shape.quadraticCurveTo(0.073, 0.075, 0.075, 0.095);
    shape.quadraticCurveTo(0.07, 0.175, 0, 0.15);
    return shape;
}

createShapeCapa() {
  var shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 0.38);
  shape.quadraticCurveTo(0.12, 0.4, 0.12, 0.25);
  shape.quadraticCurveTo(0.13, 0.1, 0.18, -0.17);
  shape.lineTo(0, -0.17);
  shape.lineTo(0, 0);
  return shape;
}

createShapeMascara() {
  var shape = new THREE.Shape();

  shape.moveTo(0, 0.107);
  shape.quadraticCurveTo(0.055, 0.135, 0.034, 0.065);
  shape.lineTo(0.034, 0.04);
  shape.quadraticCurveTo(0.055, 0.095, 0.04, 0.13);
  shape.quadraticCurveTo(0.015, 0.135, 0, 0.13);

  shape.quadraticCurveTo(-0.015, 0.135, -0.04, 0.13);
  shape.quadraticCurveTo(-0.055, 0.095, -0.034, 0.04);
  shape.lineTo(-0.034, 0.065);
  shape.quadraticCurveTo(-0.055, 0.135, 0, 0.107);

  shape.quadraticCurveTo(0.055, 0.135, 0.034, 0.065);
  shape.lineTo(0.034, 0.04);
  shape.quadraticCurveTo(0.055, 0.095, 0.04, 0.13);
  shape.quadraticCurveTo(0.015, 0.135, 0, 0.13);

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

export { Rey }

