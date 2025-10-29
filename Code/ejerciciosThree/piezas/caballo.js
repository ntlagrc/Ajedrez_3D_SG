import * as THREE from 'three'
import * as CSG from '../libs/three-bvh-csg.js'

class Caballo extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    this.createGUI(gui,titleGui);

    //materiales
    var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide}); 
    var material_blanco = new THREE.MeshStandardMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
    var material_azul = new THREE.MeshStandardMaterial({color: 0x0000FF, side: THREE.DoubleSide});
    var material_marron = new THREE.MeshStandardMaterial({color: 0x4B2E19, side: THREE.DoubleSide});
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


    //estrella
    var estrella_shape = this.createShapeEstrella();
    estrella_shape = this.rotateShape(estrella_shape,Math.PI);
    this.options_estandar = {
      steps: 1,
      depth: 0.2,             
      bevelEnabled: false
    };

    //cabeza 
    const segments = 40;
    var cabeza_shape = this.createShapeCabeza();
    const points_cabeza = cabeza_shape.getPoints();
    
    var recorteMascara_shpae = this. createShapeMascaraRecorte();
    
    var letraA_shape = this.createShapeLetraA();

    var cuello_shape = this.createShapeCuello();
    const points_cuello = cuello_shape.getPoints();

    //torso 
    var pectoral_shape = this.createShapePectoral();
    this.options_pectoral = {
      steps: 1,
      depth: 0.01,
      //bevelEnabled: false
    };





    //----------------------------GEOMETRIAS------------------------------------
    var guia = new THREE.BoxGeometry(0.02,0.75,0.02);

    //escudo
     var escudoBase = new THREE.CylinderGeometry(0.25,0.25,0.4,30,30);
     var escudoRecInt = new THREE.SphereGeometry(0.5,30,30);
     var escudoRecExt = new THREE.SphereGeometry(0.5,30,30);
     var circuloMitad = new THREE.CylinderGeometry(0.2,0.2,0.4,30,30);
     var circuloMitadRec = new THREE.CylinderGeometry(0.15,0.15,0.4,30,30);
     var circuloMitadRec2 = new THREE.SphereGeometry(0.5,30,30);
     //estrella
    var estrella = new THREE.ExtrudeGeometry(estrella_shape, this.options_estandar);
    var estellaRec = new THREE.SphereGeometry(0.5,30,30);
    var circuloEstrella = new THREE.CylinderGeometry(0.1,0.1,0.3,30,30);
    var circuloEstrellaRec = new THREE.SphereGeometry(0.5,30,30);

    //cabeza
    var cabeza = new THREE.LatheGeometry(points_cabeza, segments);
    var cuello = new THREE.LatheGeometry(points_cuello, segments);
    var recorteMascara = new THREE.ExtrudeGeometry(recorteMascara_shpae, this.options_estandar);
    var letraA = new THREE.ExtrudeGeometry(letraA_shape, this.options_estandar);
    var recLetraA = cabeza.clone();

    //cuerpo
    var torso = new THREE.CylinderGeometry(0.1,0.08,0.14,30,30);
    var recTorso = new THREE.BoxGeometry(0.1,0.1,0.1);
    var pectoral = new THREE.ExtrudeGeometry(pectoral_shape, this.options_pectoral);
    var abdBlanco = new THREE.CylinderGeometry(0.07,0.075,0.18,30,30);
    var abdRojo = new THREE.CylinderGeometry(0.065,0.07,0.18,30,30);
    var recRojo = new THREE.BoxGeometry(0.05,0.2,0.2);
    var recRojo2 = new THREE.BoxGeometry(0.05,0.2,0.2);
    var cinturon = new THREE.CylinderGeometry(0.08,0.08,0.04,30,30);
    var estrellaPecho = estrella.clone();

    //piernas 
    var pelvis = new THREE.CylinderGeometry(0.07,0.02,0.08,30,30);
    var muslo = new THREE.CylinderGeometry(0.05,0.035,0.2,30,30);
    var rodilla = new THREE.SphereGeometry(0.035,30,30);
    var pierna = new THREE.CylinderGeometry(0.035,0.025,0.18,30,30);
    var pie = new THREE.CylinderGeometry(0.02,0.02,0.03,30,30);

    //brazos
    //brazoIzq
    var hombroIzq = new THREE.SphereGeometry(0.035,30,30);
    var brazoIzq = new THREE.CylinderGeometry(0.033,0.025,0.13,30,30);
    var codoIzq = new THREE.SphereGeometry(0.025,30,30);
    var antebrazoIzq = new THREE.CylinderGeometry(0.023,0.015,0.1,30,30);
    var manoIzq = new THREE.SphereGeometry(0.023,30,30);
    //brazoDer
    var hombroDer = hombroIzq.clone();
    var brazoDer = brazoIzq.clone();
    var codoDer = codoIzq.clone();
    var antebrazoDer = antebrazoIzq.clone();
    var manoDer = manoIzq.clone();




    //-------------------------TRANSFORMACIONES---------------------------------
    //guia
    guia.translate(0.5,0.375,0);

    //escudo
    escudoBase.rotateX(Math.PI / 2);
    escudoRecInt.translate(0,0,-0.4);
    escudoRecExt.translate(0,0,-0.38);
    circuloMitad.rotateX(Math.PI / 2);
    circuloMitadRec.rotateX(Math.PI / 2);
    circuloMitadRec2.translate(0,0,-0.37);
    //estrella
    estellaRec.translate(0,0,-0.36);
    circuloEstrellaRec.translate(0,0,-0.37);
    circuloEstrella.rotateX(Math.PI / 2);

    //cabeza
    cabeza.scale(1.1,1,1.1);
    cuello.scale(1.2,1,0.7);
    recLetraA.scale(1.15,1.05,1.15);
    recLetraA.translate(0,0,0.01);
    //recLetraA.translate(0,0.1,0);

    //cuerpo
    torso.scale(1.2,1,0.7);
    torso.translate(0,0.07,0);
    recTorso.rotateY(Math.PI / 4);
    recTorso.rotateX(Math.PI / 2);
    recTorso.translate(0,-0.035,0.05);
    recTorso.scale(3,1,1);
    pectoral.rotateY(Math.PI / 2);
    pectoral.scale(0.25,0.4,0.2);
    pectoral.translate(0.04,0.07,0.06);
    estrellaPecho.scale(0.4,0.4,0.5);
    estrellaPecho.translate(0,0.1,-0.02);

    abdBlanco.scale(1.2,1,0.7);
    abdRojo.scale(1.2,1,0.7);
    recRojo.translate(0.05,0,0);
    recRojo2.translate(-0.05,0,0);
    cinturon.scale(1.2,1,0.7);
    cinturon.translate(0,0.02,0);

    //piernas
    pelvis.translate(0,-0.04,0);
    pelvis.scale(1.2,1,0.7);
    muslo.translate(0,0.11,0);
    pie.scale(1.5,1,3);
    pie.translate(0,0,0.03);

    //brazos
    //brazoIzq
    hombroIzq.translate(0.1,0.57,0);
    brazoIzq.rotateX(Math.PI/4);
    brazoIzq.rotateY(-Math.PI/7);
    brazoIzq.translate(0.135,0.515,-0.05);
    codoIzq.translate(0.164,0.455,-0.1);
    antebrazoIzq.rotateX(-Math.PI/3);
    antebrazoIzq.translate(0.165, 0.42, -0.045);
    manoIzq.translate(0.165, 0.40, 0);
    //brazoDer
    hombroDer.translate(-0.1,0.57,0);
    brazoDer.rotateZ(-Math.PI/4);
    brazoDer.rotateY(Math.PI/4);
    brazoDer.translate(-0.14,0.52,0.05);
    codoDer.translate(-0.18,0.465,0.09);
    antebrazoDer.rotateZ(Math.PI/7);
    antebrazoDer.rotateX(-Math.PI/6);
    antebrazoDer.translate(-0.15,0.42,0.12)
    manoDer.translate(-0.12,0.37,0.15)






    //----------------------OPERACIONES BOOLEANAS------------------------------
    //guia
    var guiaBrush = new CSG.Brush(guia,material_rojo);
    //escudo
    var escudoBaseBrush = new CSG.Brush(escudoBase,material_rojo);
    var escudoRecIntBrush = new CSG.Brush(escudoRecInt,material_rojo);
    var escudoRecExtBrush = new CSG.Brush(escudoRecExt,material_rojo);
    var circuloMitadBrush =  new CSG.Brush(circuloMitad,material_blanco);
    var circuloMitadRecBrush  = new CSG.Brush(circuloMitadRec,material_blanco);
    var circuloMitadRec2Brush  = new CSG.Brush(circuloMitadRec2,material_blanco);
    var estrellaBrush = new CSG.Brush(estrella,material_azul);
    var estellaRecBrush = new CSG.Brush(estellaRec,material_blanco);
    var circuloEstrellaBrush = new CSG.Brush(circuloEstrella,material_azul);
    var circuloEstrellaRecBrush = new CSG.Brush(circuloEstrellaRec,material_azul);
    //cabeza
    var cabezaBrush = new CSG.Brush(cabeza,material_piel);
    var cuelloBrush = new CSG.Brush(cuello,material_azul);
    var recorteMascaraBrush = new CSG.Brush(recorteMascara,material_azul);
    var letraABrush = new CSG.Brush(letraA,material_blanco);
    var recLetraABrush = new CSG.Brush(recLetraA,material_blanco);
    //cuerpo
    var torsoBrush = new CSG.Brush(torso,material_azul);
    var recTorsoBrush = new CSG.Brush(recTorso,material_azul);
    var pectoralBrush = new CSG.Brush(pectoral,material_azul);
    var estrellaPechoBrush = new CSG.Brush(estrellaPecho, material_blanco);
    var abdBlancoBrush = new CSG.Brush(abdBlanco,material_blanco);
    var abdRojoBrush = new CSG.Brush(abdRojo,material_rojo);
    var recRojoBrush = new CSG.Brush(recRojo,material_blanco);
    var recRojo2Brush = new CSG.Brush(recRojo2,material_blanco);
    var cinturonBrush = new CSG.Brush(cinturon,material_marron);
    //piernas
    var pelvisBrush = new CSG.Brush(pelvis,material_azul);
    var musloBrush = new CSG.Brush(muslo,material_azul);
    var rodillaBrush = new CSG.Brush(rodilla,material_azul);
    var piernaBrush = new CSG.Brush(pierna,material_rojo);
    var pieBrush = new CSG.Brush(pie,material_rojo);
    //brazos
    //brazoIzq
    var hombroIzqBrush = new CSG.Brush(hombroIzq,material_azul);
    var brazoIzqBrush = new CSG.Brush(brazoIzq,material_azul); 
    var codoIzqBrush = new CSG.Brush(codoIzq,material_azul); 
    var antebrazoIzqBrush = new CSG.Brush(antebrazoIzq,material_rojo); 
    var manoIzqBrush = new CSG.Brush(manoIzq,material_rojo); 
    //brazoDer
    var hombroDerBrush = new CSG.Brush(hombroDer,material_azul);
    var brazoDerBrush = new CSG.Brush(brazoDer,material_azul);
    var codoDerBrush = new CSG.Brush(codoDer,material_azul);
    var antebrazoDerBrush = new CSG.Brush(antebrazoDer,material_rojo);
    var manoDerBrush = new CSG.Brush(manoDer,material_rojo);

    






    //mascara
    var mascara = cabezaBrush.geometry.clone();
    mascara.scale(1.2,1.1,1.2);
    mascara.translate(0,-0.005,0);
    var mascaraBrush = new CSG.Brush(mascara,material_azul);
    //pectoral2
    var pectoral2 = pectoralBrush.geometry.clone();
    pectoral2.scale(-1,1,1);
    pectoral2.computeVertexNormals();
    var pectoral2Brush = new CSG.Brush(pectoral2,material_azul);


    //----------------------------------------------------------------------------------------------------
    var evaluador = new CSG.Evaluator();

    //escudo
    var escudoRec2 = evaluador.evaluate(escudoBaseBrush,escudoRecExtBrush, CSG.INTERSECTION);
    var escudoEstrellaBase = evaluador.evaluate(escudoRec2,estrellaBrush, CSG.ADDITION);
    var escudoEstrellaRec1 = evaluador.evaluate(escudoEstrellaBase,estellaRecBrush, CSG.INTERSECTION); 
    var circuloEstrella = evaluador.evaluate(circuloEstrellaBrush,circuloEstrellaRecBrush, CSG.INTERSECTION);
    var escudEstreCirculo = evaluador.evaluate(escudoEstrellaRec1,circuloEstrella, CSG.ADDITION);
    var circuloMitadBase = evaluador.evaluate(circuloMitadBrush,circuloMitadRecBrush, CSG.SUBTRACTION);
    var circuloMitad = evaluador.evaluate(circuloMitadBase,circuloMitadRec2Brush, CSG.INTERSECTION);
    var escudoCompleto = evaluador.evaluate(escudEstreCirculo,circuloMitad, CSG.ADDITION);
    var escudo = evaluador.evaluate(escudoCompleto,escudoRecIntBrush, CSG.SUBTRACTION);
    escudo.geometry.scale(0.8,0.8,0.8);

    var mascara = evaluador.evaluate(mascaraBrush,recorteMascaraBrush, CSG.SUBTRACTION);
    var cabezaMascara = evaluador.evaluate(mascara,cabezaBrush, CSG.ADDITION);

    var letraA = evaluador.evaluate(letraABrush,recLetraABrush, CSG.INTERSECTION);
    var cabeza = evaluador.evaluate(cabezaMascara,letraA, CSG.ADDITION);

    var cabezaCuello = evaluador.evaluate(cabeza,cuelloBrush, CSG.ADDITION);
    cabezaCuello.geometry.translate(0,0.03,0);

    //cuerpo
    cabezaCuello.geometry.translate(0,0.14,0);
    var torso = evaluador.evaluate(cabezaCuello,torsoBrush, CSG.ADDITION);
    var pectoral1 = evaluador.evaluate(torso,pectoralBrush, CSG.ADDITION);
    var pectoral2 = evaluador.evaluate(pectoral1,pectoral2Brush, CSG.ADDITION);
    var torsoEstrella = evaluador.evaluate(pectoral2,estrellaPechoBrush, CSG.ADDITION);
    var torsoComple = evaluador.evaluate(torsoEstrella,recTorsoBrush, CSG.SUBTRACTION);
    torsoComple.geometry.translate(0,0.05,0);

    var recAbdomen = evaluador.evaluate(recRojoBrush,recRojo2Brush, CSG.ADDITION);
    var abdBlancoRec1 = evaluador.evaluate(abdBlancoBrush,recAbdomen, CSG.SUBTRACTION);
    var abdomen = evaluador.evaluate(abdBlancoRec1,abdRojoBrush, CSG.ADDITION);

    var cuerpoArriba = evaluador.evaluate(torsoComple,abdomen, CSG.ADDITION);
    cuerpoArriba.geometry.translate(0,0.1,0);
    var cintura = evaluador.evaluate(cuerpoArriba,cinturonBrush, CSG.ADDITION);
    var pelvis = evaluador.evaluate(cintura,pelvisBrush, CSG.ADDITION);

    pelvis.geometry.translate(0,0.42,0);

    //piernas
    var rodilla = evaluador.evaluate(musloBrush, rodillaBrush,CSG.ADDITION);
    rodilla.geometry.translate(0,0.11,0);
    var pierna = evaluador.evaluate(rodilla, piernaBrush,CSG.ADDITION);
    pierna.geometry.translate(0,0.1,0);
    var pie = evaluador.evaluate(pierna, pieBrush,CSG.ADDITION);
    pie.geometry.translate(-0.045,0,0);
    //copia otra pierna
    var piernaIzq = pie.clone(true);
    piernaIzq.scale.x = -1;
    piernaIzq.updateMatrix();
    var geom2 = piernaIzq.geometry.clone();
    geom2.applyMatrix4(piernaIzq.matrix);
    geom2.computeVertexNormals();
    var mat2 = Array.isArray(piernaIzq.material) ? piernaIzq.material.map(m=>m.clone()) : piernaIzq.material.clone();
    var piernaIzqBrush = new CSG.Brush(geom2, mat2);

    var piernas = evaluador.evaluate(pie, piernaIzqBrush,CSG.ADDITION);

    var cuerpoSinBrazos = evaluador.evaluate(piernas, pelvis,CSG.ADDITION);
    cuerpoSinBrazos.geometry.scale(0.85,0.85,0.85);

    //brazos
    //brazoIzq
    var brazoIzq = evaluador.evaluate(hombroIzqBrush, brazoIzqBrush,CSG.ADDITION);
    var codoIzq = evaluador.evaluate(brazoIzq, codoIzqBrush,CSG.ADDITION);
    var antebrazoIzq = evaluador.evaluate(codoIzq, antebrazoIzqBrush,CSG.ADDITION);
    var manoIzq = evaluador.evaluate(antebrazoIzq, manoIzqBrush,CSG.ADDITION);
    //brazoDer
    var brazoDer = evaluador.evaluate(hombroDerBrush, brazoDerBrush,CSG.ADDITION);
    var codoDer = evaluador.evaluate(brazoDer, codoDerBrush,CSG.ADDITION);
    var antebrazoDer = evaluador.evaluate(codoDer, antebrazoDerBrush,CSG.ADDITION);
    var manoDer = evaluador.evaluate(antebrazoDer, manoDerBrush,CSG.ADDITION);


    var brazos = evaluador.evaluate(manoIzq, manoDer,CSG.ADDITION);

    var cuerpo= evaluador.evaluate(cuerpoSinBrazos, brazos,CSG.ADDITION);
    //cuerpo.geometry.scale(1.1,1.1,1.1);

    escudo.geometry.translate(-0.15,0.42,0.12)
    

    var caballo = evaluador.evaluate(cuerpo,escudo, CSG.ADDITION);


    //añadimos a la escena
    this.add(caballo);
  }

  createShapeEstrella(){
    var shape = new THREE.Shape();  
    shape.moveTo(0, -0.1);
    shape.lineTo(0.0309, -0.0309);
    shape.lineTo(0.0951, -0.0309);
    shape.lineTo(0.0476, 0.0118);
    shape.lineTo(0.0588, 0.0809);
    shape.lineTo(0, 0.0382);
    shape.lineTo(-0.0588, 0.0809);
    shape.lineTo(-0.0476, 0.0118);
    shape.lineTo(-0.0951, -0.0309);
    shape.lineTo(-0.0309, -0.0309);
    shape.lineTo(0, -0.1);
    return shape;
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

 createShapeCuello(){
    var shape = new THREE.Shape();
    shape.moveTo(0, 0.025);
    shape.lineTo(0.015, 0.025);
    shape.quadraticCurveTo(0.012, -0.015, 0.1, -0.02);
    shape.lineTo(0.1, -0.03);
    shape.lineTo(0, -0.03);
    shape.lineTo(0, 0.025);
    return shape;
 }

 createShapeMascaraRecorte(){
    var shape = new THREE.Shape();
  // Parte 1: contorno principal
    shape.moveTo(0, 0.085);
    shape.quadraticCurveTo(0.007, 0.085, 0.01, 0.073);
    shape.quadraticCurveTo(0.012, 0.07, 0.015, 0.07);
    shape.quadraticCurveTo(0.03, 0.07, 0.06, 0.075);
    shape.quadraticCurveTo(0.07, 0.03, 0, 0);
    shape.quadraticCurveTo(-0.07, 0.03, -0.06, 0.075);
    shape.quadraticCurveTo(-0.03, 0.07, -0.015, 0.07);
    shape.quadraticCurveTo(-0.012, 0.07, -0.01, 0.073);
    shape.quadraticCurveTo(-0.007, 0.085, 0, 0.085);
    return shape;
 }

 createShapeLetraA(){
    var shape = new THREE.Shape();
    shape.moveTo(  0.02, 0.1 );
    shape.lineTo(  0.005, 0.14 );
    shape.lineTo( -0.005, 0.14 );
    shape.lineTo( -0.02, 0.1 );
    shape.lineTo( -0.01, 0.1 );
    shape.lineTo( -0.005, 0.115 );
    shape.lineTo(  0.005, 0.115 );
    shape.lineTo(  0.01, 0.1 );
    shape.lineTo(  0.02, 0.1 );
    return shape;
 }

 createShapePectoral() {
  var shape = new THREE.Shape();
  shape.moveTo(0.04, 0.0);
  shape.quadraticCurveTo(0.01, 0.0, 0.01, 0.03);
  shape.lineTo(0.01, 0.06);
  shape.quadraticCurveTo(0.01, 0.09, 0.04, 0.09);
  shape.lineTo(0.06, 0.09);
  shape.quadraticCurveTo(0.09, 0.09, 0.09, 0.06);
  shape.lineTo(0.09, 0.03);
  shape.quadraticCurveTo(0.09, 0.0, 0.06, 0.0); 
  shape.lineTo(0.04, 0.0);
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

export { Caballo }
