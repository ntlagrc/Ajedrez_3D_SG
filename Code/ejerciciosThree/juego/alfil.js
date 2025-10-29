import { inBounds, isEmpty, isEnemy } from './movimientos.js';
import * as THREE from '../libs/three.module.js';
import * as CSG from '../libs/three-bvh-csg.js';

class Alfil extends THREE.Object3D{
  static geom = null;

  constructor(material) {
    super();
    if (Alfil.geom === null) {
      Alfil.geom = this.buildGeometry();
    }
    const mesh = new THREE.Mesh(Alfil.geom, material);
    mesh.castShadow = mesh.receiveShadow = true;
    this.add(mesh);
  }
  getValidMoves(boardState) {
  const moves = [];
  const dirs = [ [1,1], [1,-1], [-1,1], [-1,-1] ];
  for (const [dr, dc] of dirs) {
    let r = this.row + dr, 
        c = this.col + dc;
    while (inBounds(r, c)) {
      if (isEmpty(boardState, r, c)) {
        moves.push({ row: r, col: c });
      } else {
        if (isEnemy(boardState, r, c, this.color)) {
          moves.push({ row: r, col: c });
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }
  return moves;
}

  buildGeometry() {
    //materiales
    var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide}); 

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
    

    //----------------------------GEOMETRIAS------------------------------------
    var guia = new THREE.BoxGeometry(0.02,0.75,0.02);
    //martillo
    var mango = new THREE.CylinderGeometry(0.01,0.01,0.2,30,30);
    var abajoMart = new THREE.SphereGeometry(0.015,30,30);
    var martilloBase = new THREE.BoxGeometry(0.1,0.1,0.2);
    var martRec1 = new THREE.BoxGeometry(0.15,0.15,0.15);
    //cabeza
    var cabeza = new THREE.LatheGeometry(points_cabeza, segments);
    var pelo = new THREE.LatheGeometry(points_pelo, segments);
    var recPelo = new THREE.SphereGeometry(0.5,40,40);
    var recPelo2 = new THREE.BoxGeometry(0.2,0.2,0.2);
    var mechonPelo = new THREE.TubeGeometry(path_mechon, 100, 0.014, 8, false);
    var cuello = new THREE.CylinderGeometry(0.015,0.02,0.035,20,20);
    //cuerpo
    var cuerpoBase = new THREE.CylinderGeometry(0.1,0.07,0.3,20,20);
    var claviculas = new THREE.SphereGeometry(0.1,30,30);
    var capaExt = new THREE.LatheGeometry(points_capa, segments);
    var capaInt = capaExt.clone();
    var recorteCapa = new THREE.BoxGeometry(0.2,0.6,0.2);
    var cinturon = new THREE.CylinderGeometry(0.08,0.08,0.04,30,30);
    //piernas 
    var pelvis = new THREE.CylinderGeometry(0.07,0.02,0.08,30,30);
    var piernaEntera = new THREE.CylinderGeometry(0.05,0.025,0.41,30,30);
    var muslo = new THREE.CylinderGeometry(0.05,0.035,0.2,30,30);
    var rodilla = new THREE.SphereGeometry(0.035,30,30);
    var pierna = new THREE.CylinderGeometry(0.035,0.025,0.18,30,30);
    var pie = new THREE.CylinderGeometry(0.02,0.02,0.03,30,30);

    //brazo Arriba
    var manoDer = new THREE.SphereGeometry(0.025,30,30);
    var antebrazoDer = new THREE.CylinderGeometry(0.02,0.025,0.16,30,30);
    var codoDer = new THREE.SphereGeometry(0.025,30,30);
    var brazoDer = new THREE.CylinderGeometry(0.025,0.03,0.17,30,30);
    var hombroDer = new THREE.SphereGeometry(0.031,30,30);
    //brazo Izquierdo
    var manoIzq = manoDer.clone();
    var antebrazoIzq = antebrazoDer.clone();
    var codoIzq = codoDer.clone();
    var brazoIzq = brazoDer.clone();
    var hombroIzq = hombroDer.clone();



    //-------------------------TRANSFORMACIONES---------------------------------
    //guia
    guia.translate(0.5,0.375,0);
    abajoMart.translate(0,-0.1,0);
    martRec1.rotateX(Math.PI / 4);
    martRec1.translate(0,0.05,0.19);
    //cabeza
    cabeza.scale(1.1,1,1.1);
    recPelo.translate(0,0.35,-0.35);
    recPelo2.translate(0,0.06,0.105);
    mechonPelo.translate(0,0.06,0);
    cuello.translate(0,0.01,0);
    //cuerpo
    cuerpoBase.scale(1.2,1,0.7);
    claviculas.scale(1.2,0.5,0.7);
    claviculas.translate(0,0.15,0);
    capaInt.translate(0,-0.03,0);
    recorteCapa.translate(0,0.2,-0.1);
    cinturon.scale(1.2,1,0.7);
    cinturon.translate(0,0.02,0);
    
    //piernas
    pelvis.translate(0,-0.04,0);
    pelvis.scale(1.2,1,0.7);
    pie.scale(1.5,1,3);
    pie.translate(0,0,0.03);
    piernaEntera.translate(0,0.215,0);

    //brazo Derecho
    manoDer.translate(0,0.02+0.16,0);
    antebrazoDer.translate(0,0.08,0);
    //brazo Izquierdo
    manoIzq.translate(0,0.02+0.16,0);
    antebrazoIzq.translate(0,0.08,0);

    //----------------------OPERACIONES BOOLEANAS------------------------------
    //guia
    var guiaBrush = new CSG.Brush(guia,material_rojo);
    //martillo
    var mangoBrush = new CSG.Brush(mango,material_rojo);
    var abajoMartBrush = new CSG.Brush(abajoMart,material_rojo);
    var martilloBaseBrush = new CSG.Brush(martilloBase,material_rojo);
    var martRec1Brush = new CSG.Brush(martRec1,material_rojo);
    
    //cabeza
    var cabezaBrush = new CSG.Brush(cabeza,material_rojo);
    var peloBrush = new CSG.Brush(pelo,material_rojo);
    var recPeloBrush = new CSG.Brush(recPelo,material_rojo);
    var recPelo2Brush = new CSG.Brush(recPelo2,material_rojo);
    var mechonPeloBrush = new CSG.Brush(mechonPelo,material_rojo);
    var cuelloBrush = new CSG.Brush(cuello,material_rojo)

    //cuerpo
    var cuerpoBaseBrush = new CSG.Brush(cuerpoBase,material_rojo);
    var claviculasBrush = new CSG.Brush(claviculas,material_rojo);
    var capaExtBrush =  new CSG.Brush(capaExt,material_rojo);
    var capaIntBrush =  new CSG.Brush(capaInt,material_rojo);
    var recorteCapaBrush = new CSG.Brush(recorteCapa,material_rojo);
    var cinturonBrush = new CSG.Brush(cinturon,material_rojo);

    //piernas
    var pelvisBrush = new CSG.Brush(pelvis,material_rojo);
    var piernaEnteraBrush = new CSG.Brush(piernaEntera,material_rojo);
    var pieBrush = new CSG.Brush(pie,material_rojo);

    //brazo Derecho
    var manoDerBrush = new CSG.Brush(manoDer,material_rojo);
    var antebrazoDerBrush = new CSG.Brush(antebrazoDer,material_rojo);
    var codoDerBrush = new CSG.Brush(codoDer,material_rojo);
    var brazoDerBrush = new CSG.Brush(brazoDer,material_rojo);
    var hombroDerBrush = new CSG.Brush(hombroDer,material_rojo);
    //brazo Izquierdo
    var manoIzqBrush = new CSG.Brush(manoIzq,material_rojo);
    var antebrazoIzqBrush = new CSG.Brush(antebrazoIzq,material_rojo);
    var codoIzqBrush = new CSG.Brush(codoIzq,material_rojo);
    var brazoIzqBrush = new CSG.Brush(brazoIzq,material_rojo);
    var hombroIzqBrush = new CSG.Brush(hombroIzq,material_rojo);



    //recortes martillo
    var martRec2 = martRec1Brush.geometry.clone();
    martRec2.rotateZ(Math.PI / 2);
    var martRec2Brush = new CSG.Brush(martRec2,material_rojo);

    var martRec3 = martRec2Brush.geometry.clone();
    martRec3.rotateZ(Math.PI / 2);
    var martRec3Brush = new CSG.Brush(martRec3,material_rojo);

    var martRec4 = martRec3Brush.geometry.clone();
    martRec4.rotateZ(Math.PI / 2);
    var martRec4Brush = new CSG.Brush(martRec4,material_rojo);

    //copia mechon
    var mechonPeloDer = mechonPeloBrush.geometry.clone();
    mechonPeloDer.scale(-1,1,1);
    mechonPeloDer.computeVertexNormals();
    var mechonPeloDerBrush = new CSG.Brush(mechonPeloDer,material_rojo);
    
    

    //----------------------------------------------------------------------------------------------------
    var evaluador = new CSG.Evaluator();

    //martillo
    var mango = evaluador.evaluate(mangoBrush,abajoMartBrush, CSG.ADDITION);
    var recorteMartillo1 = evaluador.evaluate(martRec1Brush,martRec2Brush, CSG.ADDITION);
    var recorteMartillo2 = evaluador.evaluate(recorteMartillo1,martRec3Brush, CSG.ADDITION);
    var recorteMartilloA = evaluador.evaluate(recorteMartillo2,martRec4Brush, CSG.ADDITION);
    var recorteMartilloB = recorteMartilloA.geometry.clone();
    recorteMartilloB.rotateY(Math.PI);
    var recorteMartilloBBrush = new CSG.Brush(recorteMartilloB,material_rojo);
    var recorteMartillo = evaluador.evaluate(recorteMartilloA,recorteMartilloBBrush, CSG.ADDITION);
    var piedra = evaluador.evaluate(martilloBaseBrush,recorteMartillo, CSG.SUBTRACTION);
    piedra.geometry.translate(0,0.1,0);
    var martillo = evaluador.evaluate(mango,piedra, CSG.ADDITION);

    //cabeza
    var cabezaCuello = evaluador.evaluate(cuelloBrush,cabezaBrush, CSG.ADDITION);
    var peloRec1 = evaluador.evaluate(peloBrush,recPeloBrush, CSG.INTERSECTION);
    var peloRec2 = evaluador.evaluate(peloRec1,recPelo2Brush, CSG.SUBTRACTION);
    var mechones = evaluador.evaluate(mechonPeloDerBrush,mechonPeloBrush, CSG.ADDITION);
    var pelo = evaluador.evaluate(peloRec2,mechones, CSG.ADDITION);
    var cabeza = evaluador.evaluate(cabezaCuello,pelo, CSG.ADDITION);
    cabeza.geometry.translate(0,0.007,0);
    cabeza.geometry.translate(0,0.2,0);
    var claviculas = evaluador.evaluate(cabeza,claviculasBrush, CSG.ADDITION);

    //cuerpo
    var cuerpoBase = evaluador.evaluate(cuerpoBaseBrush,claviculasBrush, CSG.ADDITION);

    var capa1 = evaluador.evaluate(capaExtBrush,capaIntBrush, CSG.SUBTRACTION);
    var capa = evaluador.evaluate(capa1,recorteCapaBrush, CSG.INTERSECTION);
    capa.geometry.scale(1.4,1,1);
    capa.geometry.translate(0,-0.17,0);
    var cuerpoCapa = evaluador.evaluate(cuerpoBase,capa, CSG.ADDITION);
    var cuerpoArriba = evaluador.evaluate(claviculas,cuerpoCapa, CSG.ADDITION);
    cuerpoArriba.geometry.translate(0,0.15,0);
    var cintura = evaluador.evaluate(cuerpoArriba,cinturonBrush, CSG.ADDITION);
    var pelvis = evaluador.evaluate(cintura,pelvisBrush, CSG.ADDITION);
    pelvis.geometry.translate(0,0.42,0);

    //pierna
    var pie = evaluador.evaluate(piernaEnteraBrush, pieBrush,CSG.ADDITION);
    pie.geometry.translate(-0.045,0,0);
    var piernaIzq = pie.geometry.clone();
    piernaIzq.scale(-1,1,1);
    piernaIzq.computeVertexNormals();
    var piernaIzqBrush = new CSG.Brush(piernaIzq,material_rojo);
    var piernas = evaluador.evaluate(pie,piernaIzqBrush, CSG.ADDITION);


    //brazo Derecho
    martillo.geometry.rotateX(-Math.PI/2);
    martillo.geometry.translate(0,0.2,-0.03 );
    var manoMartillo = evaluador.evaluate(manoDerBrush,martillo, CSG.ADDITION);
    var antebrazoDer = evaluador.evaluate(manoMartillo,antebrazoDerBrush, CSG.ADDITION);
    antebrazoDer.geometry.translate(0,0.015,0);
    antebrazoDer.geometry.rotateZ(-Math.PI/5);
    var codoDer = evaluador.evaluate(antebrazoDer,codoDerBrush, CSG.ADDITION);
    codoDer.geometry.translate(0,0.1,0);
    var brazoDer = evaluador.evaluate(codoDer,brazoDerBrush, CSG.ADDITION);
    brazoDer.geometry.translate(0,0.1,0);
    brazoDer.geometry.rotateZ(Math.PI/9);
    brazoDer.geometry.rotateX(Math.PI/7);
    var hombroDer = evaluador.evaluate(brazoDer,hombroDerBrush, CSG.ADDITION);
    hombroDer.geometry.scale(0.8,0.8,0.8);
    hombroDer.geometry.translate(-0.11,0.58,0);
    //brazo Izquierdo
    var antebrazoIzq = evaluador.evaluate(manoIzqBrush,antebrazoIzqBrush, CSG.ADDITION);
    antebrazoIzq.geometry.translate(0,0.02,0);
    antebrazoIzq.geometry.rotateZ(-Math.PI/8);
    antebrazoIzq.geometry.rotateY(-Math.PI/4);
    var codoIzq = evaluador.evaluate(antebrazoIzq,codoIzqBrush, CSG.ADDITION);
    codoIzq.geometry.translate(0,0.1,0);
    var brazoIzq = evaluador.evaluate(codoIzq,brazoIzqBrush, CSG.ADDITION);
    brazoIzq.geometry.translate(0,0.1,0);
    brazoIzq.geometry.rotateZ(-170*Math.PI/180);
    var hombroIzq = evaluador.evaluate(brazoIzq,hombroIzqBrush, CSG.ADDITION);
    hombroIzq.geometry.scale(0.8,0.8,0.8);
    hombroIzq.geometry.translate(0.11,0.58,0);

    var brazos = evaluador.evaluate(hombroDer,hombroIzq, CSG.ADDITION);

    
    var cuerpoSinBrazos = evaluador.evaluate(pelvis,piernas, CSG.ADDITION);
    cuerpoSinBrazos.geometry.scale(0.85,0.85,0.85);
    
    var alfil = evaluador.evaluate(brazos,cuerpoSinBrazos, CSG.ADDITION);
    
    const finalGeom = alfil.geometry.clone();
    return finalGeom;
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
    shape.quadraticCurveTo(0.1, 0.38, 0.1, 0.25);
    shape.quadraticCurveTo(0.1, 0.1, 0.18, -0.1);
    shape.lineTo(0, -0.1);
    shape.lineTo(0, 0);
    return shape;
  }

  update() {}
}

export { Alfil };