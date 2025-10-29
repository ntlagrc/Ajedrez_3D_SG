import * as THREE from 'three'
import * as TWEEN from '../libs/tween.module.js';
import * as CSG from '../libs/three-bvh-csg.js'

class Reina extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    //this.createGUI(gui,titleGui);

    //materiales
        var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide});
        var material_blanco = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    
        var reina = this.createReinaCuerpo();
        const reinaMesh = new THREE.Mesh(reina,material_blanco);
    
        this.joint1 = new THREE.Object3D;
        this.joint1.position.set(-0.065,0.57,0);
        reinaMesh.add(this.joint1);
        var brazoHombro = this.createBrazo();
        const brazoHombroMesh = new THREE.Mesh(brazoHombro,material_blanco);
        this.joint1.add(brazoHombroMesh);
    
        this.joint2 = new THREE.Object3D;
        this.joint2.position.set(0,0.133,0);
        brazoHombroMesh.add(this.joint2);
        var antebrazo = this.createAntebrazo();
        var antebrazoMesh = new THREE.Mesh(antebrazo,material_blanco);
        this.joint2.add(antebrazoMesh);
    
        this.joint3 = new THREE.Object3D;
        this.joint3.position.set(0,0.14,0);
        antebrazoMesh.add(this.joint3);
        var mano = this.createMano();
        const manoMesh = new THREE.Mesh(mano,material_blanco);
        this.joint3.add(manoMesh);
        
        //bola
        this.joint4 = new THREE.Object3D;
        this.joint4.position.set(0,0.05,0.05);
        manoMesh.add(this.joint4);
        var bola = this.createBola();
        const bolaMesh = new THREE.Mesh(bola,material_rojo);
        this.joint4.add(bolaMesh);
    
    
        this.joint1.rotation.z = 155 * Math.PI / 180;
        this.joint2.rotation.z = -Math.PI / 8;
        this.joint2.rotation.x = Math.PI / 6
    
      // Brazo izquierdo 
        this.joint1B = new THREE.Object3D;
        this.joint1B.position.set(0.065,0.57,0);
        reinaMesh.add(this.joint1B);
        var brazoHombroB = brazoHombro.clone();
        brazoHombroB.scale(-1,1,1);
        brazoHombroB.computeVertexNormals();
        const brazoHombroMeshB = new THREE.Mesh(brazoHombroB,material_blanco);
        this.joint1B.add(brazoHombroMeshB);
    
        this.joint2B = new THREE.Object3D;
        this.joint2B.position.set(0,0.133,0);
        brazoHombroMeshB.add(this.joint2B);
        var antebrazoB = antebrazo.clone();
        antebrazoB.scale(-1,1,1);
        antebrazoB.computeVertexNormals();
        var antebrazoMeshB = new THREE.Mesh(antebrazoB,material_blanco);
        this.joint2B.add(antebrazoMeshB);
    
        this.joint3B = new THREE.Object3D;
        this.joint3B.position.set(0,0.14,0);
        antebrazoMeshB.add(this.joint3B);
        var manoB = mano.clone();
        manoB.scale(-1,1,1);
        manoB.computeVertexNormals();
        const manoMeshB = new THREE.Mesh(manoB,material_blanco);
        this.joint3B.add(manoMeshB);
    
        //bola
        this.joint4B = new THREE.Object3D;
        this.joint4B.position.set(0,0.05,0.05);
        manoMeshB.add(this.joint4B);
        var bolaB = bola.clone();
        const bolaMeshB = new THREE.Mesh(bolaB,material_rojo);
        this.joint4B.add(bolaMeshB);
    
    
        this.joint1B.rotation.z = -155 * Math.PI / 180;
        this.joint2B.rotation.z = Math.PI / 8;
        this.joint2B.rotation.x = Math.PI / 6
    
    /*
        //Escenas clave
        //E1
        this.joint1.rotation.z =70*Math.PI/180;
        this.joint1B.rotation.z =-70*Math.PI/180
        this.joint2.rotation.z = -70*Math.PI/180;
        this.joint2B.rotation.z = 70*Math.PI/180;
    
        //E2
        this.joint4.scale.set(10,10,10);
        this.joint4B.scale.set(10,10,10);
    
        //E3
        this.joint3.rotation.x =-60*Math.PI/180;
        this.joint3B.rotation.x =-60*Math.PI/180;
        this.joint2.rotation.z = -40*Math.PI / 180;
        this.joint2B.rotation.z = 40*Math.PI / 180;
    
        this.joint1.rotation.x =60*Math.PI/180;
        this.joint1B.rotation.x = 60*Math.PI/180;
        this.joint1.rotation.y =30*Math.PI/180;
        this.joint1B.rotation.y = -30*Math.PI/180;
    
        //E4
        mover joint4 distancia
    */
    
    
    
    
    
        this.add(reinaMesh);

  }

  createBola(){
    var bola = new THREE.SphereGeometry(0.005,20,20);
    return bola;
  }

  createMano(){
    var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide}); //840707
    //mano
    var palma = new THREE.SphereGeometry(0.018,30,30);
    var dedoA1 = new THREE.CylinderGeometry(0.0035,0.0035,0.02,30,30);
    var dedoB1 = new THREE.CylinderGeometry(0.0035,0.0035,0.02,30,30); 


    //mano
    palma.scale(1,1,0.5);
    palma.translate(0,0.018,0);
    dedoA1.translate(0,0.045,0);
    dedoB1.rotateX(Math.PI / 10)
    dedoB1.translate(0,0.064,0.003);
    
    //manos
    var palmaBrush = new CSG.Brush(palma,material_rojo);
    var dedoA1Brush = new CSG.Brush(dedoA1,material_rojo);
    var dedoB1Brush = new CSG.Brush(dedoB1,material_rojo);

    var evaluador = new CSG.Evaluator();


    //-----------------manos--------------
    var dedo1 = evaluador.evaluate(dedoA1Brush, dedoB1Brush, CSG.ADDITION);

    var dedo2 = dedo1.geometry.clone();
    dedo2.translate(0,-0.005,0);
    dedo2.rotateZ(Math.PI / 11);
    var dedo2Brush = new CSG.Brush(dedo2,material_rojo)
    var dedo2 = evaluador.evaluate(dedo1, dedo2Brush, CSG.ADDITION);

    var dedo3 = dedo1.geometry.clone();
    dedo3.translate(0,-0.005,0);
    dedo3.rotateZ(-Math.PI / 11);
    var dedo3Brush = new CSG.Brush(dedo3,material_rojo)
    var dedo3 = evaluador.evaluate(dedo2, dedo3Brush, CSG.ADDITION);

    var dedo4 = dedo1.geometry.clone();
    dedo4.translate(0,-0.009,0);
    dedo4.rotateZ(Math.PI / 6);
    dedo4.rotateY(Math.PI / 12);
    dedo4.translate(0,0,-0.0025);
    var dedo4Brush = new CSG.Brush(dedo4,material_rojo)
    var dedo4 = evaluador.evaluate(dedo3, dedo4Brush, CSG.ADDITION);

    var dedo5 = dedo1.geometry.clone();
    dedo5.scale(1.1,1,1.1);
    dedo5.translate(-0.02,-0.015,0);
    dedo5.rotateZ(-Math.PI / 3);
    dedo5.translate(0,-0.015,0);
    dedo4.rotateY(Math.PI / 8);
    var dedo5Brush = new CSG.Brush(dedo5,material_rojo)
    var dedo5 = evaluador.evaluate(dedo4, dedo5Brush, CSG.ADDITION);

    var mano = evaluador.evaluate(dedo5, palmaBrush, CSG.ADDITION);
    //mano.geometry.translate(0,0.14,0);

    return mano.geometry.clone();
  }

  createAntebrazo(){
    var antebrazo = new THREE.CylinderGeometry(0.01,0.015,0.14,30,30);
    antebrazo.translate(0,0.07,0);
    return antebrazo.clone();
  }

  createBrazo(){
    var evaluador = new CSG.Evaluator();
    var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide}); //840707

    //brazos
    var hombro = new THREE.SphereGeometry(0.025,30,30);
    var codo = new THREE.SphereGeometry(0.016,30,30);
    var brazo = new THREE.CylinderGeometry(0.017,0.021,0.15,30,30);

    //brazos
    codo.translate(0,0.016,0);
    brazo.translate(0,0.075,0);

    //brazos
    var hombroDerBrush = new CSG.Brush(hombro,material_rojo);
    var codoBrush = new CSG.Brush(codo,material_rojo);
    var brazoBrush = new CSG.Brush(brazo,material_rojo);

    //brazos------------------
    codoBrush.geometry.translate(0,0.145,0);
    var brazo = evaluador.evaluate(codoBrush, brazoBrush, CSG.ADDITION);
    var brazo1 = evaluador.evaluate(brazo, hombroDerBrush, CSG.ADDITION);
    brazo1.geometry.scale(1,0.8,1);
    //brazo1.geometry.translate(0,0.02,0);

    return brazo1.geometry.clone();
  }

  createReinaCuerpo(){
    var material_rojo = new THREE.MeshStandardMaterial({color: 0xCF0000, side: THREE.DoubleSide}); //840707

    //cabeza
    var cabeza_shape = this.createShapeCabeza();
    const points_cabeza = cabeza_shape.getPoints();

    //mascara
    var mascara_shape = this.createShapeMascara();
    mascara_shape = this.rotateShape(mascara_shape, Math.PI / 2)
    this.points_mascara = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0.05),
    ];
    var path_mascara = new THREE.CatmullRomCurve3(this.points_mascara);

    this.options_mascara = {
      steps: 100,             
      bevelEnabled: false,
      extrudePath: path_mascara,
    }

    //pelo
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

    //cuerpo
    //abdomen
    var abdomen_shape = this.createShapeAbdomen();
    const points_abdomen = abdomen_shape.getPoints();

    //torso
    var torsoBase_shape = this.createShapeBaseTorso();
    const points_torso = torsoBase_shape.getPoints();
    
    var torsoRecorte_shape = this.createShapeRecorteTorso();
    this.options_Recortetorso = {
      steps: 1,
      depth: 0.2,             
      bevelEnabled: false
    };
    //claviculas
    var claviculas_shape = this.createShapeClaviculas();
    this.options_claviculas = {
      steps: 1,
      depth: 0.12,
      bevelEnabled: false
    };

    //falda
    var falda = this.createShapeFalda();
    const points_falda = falda.getPoints().reverse();
    const segments = 40;

    var falda_apertura = this.createShapeFaldaApertura();
    falda_apertura = this.rotateShape(falda_apertura, Math.PI / 2)
    this.points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 2),
    ];
    var path_apertura = new THREE.CatmullRomCurve3(this.points);

    this.options_faldaApertura = {
      steps: 100,
      bevelEnabled: false,
      extrudePath: path_apertura
    };


    //----------------------------GEOMETRIAS------------------------------------
    //cabeza
    var cuello = new THREE.CylinderGeometry(0.015,0.02,0.035,20,20);
    var cabeza = new THREE.LatheGeometry(points_cabeza, segments);
    var mascara = new THREE.ExtrudeGeometry(mascara_shape, this.options_mascara);
    var cilMascaraExt = new THREE.CylinderGeometry(0.075,0.075,0.2,30,30);
    var cilMascaraInt = new THREE.CylinderGeometry(0.06,0.06,0.2,30,30);
    var pelo = new THREE.LatheGeometry(points_pelo, segments);
    var recPelo = new THREE.SphereGeometry(0.5,40,40);
    var recPelo2 = new THREE.BoxGeometry(0.2,0.2,0.2);
    var mechonPelo = new THREE.TubeGeometry(path_mechon, 100, 0.014, 8, false);
    //cuerpo
    var abdomen = new THREE.LatheGeometry(points_abdomen, segments);
    var torsoBase = new THREE.LatheGeometry(points_torso, segments);
    var recorteTorso = new THREE.ExtrudeGeometry(torsoRecorte_shape, this.options_Recortetorso);
    var recorteAtrasTorso = new THREE.CylinderGeometry(0.07,0.06,0.15,30,30);
    var ajusteRecorteAtras = new THREE.BoxGeometry(0.3,0.2,0.2);
    var claviculas = new THREE.ExtrudeGeometry(claviculas_shape, this.options_claviculas);

    //falda
    var faldaExt = new THREE.LatheGeometry(points_falda, segments);
    var faldaInt = faldaExt.clone();
    var faldaApertura = new THREE.ExtrudeGeometry(falda_apertura, this.options_faldaApertura);


    //piernas
    var piernaEntera = new THREE.CylinderGeometry(0.02,0.015,0.32,30,30);
    var pieBase = new THREE.CylinderGeometry(0.001,0.03,0.05,4,4);
    var pierRecorte = new THREE.BoxGeometry(0.2,0.13,0.13);

    //temp 
    var guia = new THREE.BoxGeometry(0.02,0.75,0.02);

    

    //-------------------------TRANSFORMACIONES---------------------------------

    //cabeza
    cuello.translate(0,0.01,0);
    cilMascaraExt.translate(0,0.095,-0.03);
    cilMascaraInt.translate(0,0.095,-0.03);
    recPelo.translate(0,0.35,-0.35);
    recPelo2.translate(0,0.06,0.105);
    mechonPelo.translate(0,0.06,0);
    //cuerpo
    recorteTorso.translate(0,0,-0.1)
    recorteAtrasTorso.translate(0,0.21,0);
    ajusteRecorteAtras.translate(0,0.235,0.1)
    claviculas.rotateY(Math.PI / 2);
    claviculas.scale(1,0.8,0.8);
    claviculas.translate(-0.06,0.04,0);
    //falda
    faldaInt.translate(0,-0.03,0);
    faldaApertura.scale(1,1.2,1);
    faldaApertura.translate(0,-0.01,0);
    //pierna
    pieBase.scale(1,1,1.7);
    pieBase.translate(-0.035,0.025,0);
    pierRecorte.translate(0,0.05,-0.08);
    piernaEntera.translate(-0.035,0.2,0);

    //guia
    guia.translate(0.3,0.375,0);
    





    //----------------------OPERACIONES BOOLEANAS------------------------------
    //cabeza
    var cuelloBrush = new CSG.Brush(cuello,material_rojo);
    var cabezaBrush = new CSG.Brush(cabeza,material_rojo);
    var mascaraBrush = new CSG.Brush(mascara,material_rojo);
    var cilMascaraExtBrush = new CSG.Brush(cilMascaraExt,material_rojo);
    var cilMascaraIntBrush = new CSG.Brush(cilMascaraInt,material_rojo);
    var peloBrush = new CSG.Brush(pelo,material_rojo);
    var recPeloBrush = new CSG.Brush(recPelo,material_rojo);
    var recPelo2Brush = new CSG.Brush(recPelo2,material_rojo);
    var mechonPeloBrush = new CSG.Brush(mechonPelo,material_rojo);
    //cuerpo
    var abdomenBrush = new CSG.Brush(abdomen,material_rojo); 
    var torsoBaseBrush = new CSG.Brush(torsoBase,material_rojo); 
    var recorteTorsoBrush = new CSG.Brush(recorteTorso,material_rojo);
    var recorteAtrasTorsoBrsuh = new CSG.Brush(recorteAtrasTorso,material_rojo);
    var ajusteRecorteAtrasBrush = new CSG.Brush(ajusteRecorteAtras,material_rojo);
    var claviculasBrush = new CSG.Brush(claviculas,material_rojo);
    //falda
    var faldaExtBrush = new CSG.Brush(faldaExt,material_rojo);
    var faldaIntBrush = new CSG.Brush(faldaInt,material_rojo);
    var faldaAperturaBrush = new CSG.Brush(faldaApertura,material_rojo); 

    //pierna
    var pieBaseBrush = new CSG.Brush(pieBase,material_rojo);
    var pieRecorteBrush = new CSG.Brush(pierRecorte,material_rojo);
    var piernaEnteraBrush = new CSG.Brush(piernaEntera,material_rojo);

    //guia
    var guiaBrush = new CSG.Brush(guia,material_rojo);


    //copia mechon
    var mechonPeloDer = mechonPeloBrush.geometry.clone();
    mechonPeloDer.scale(-1,1,1);
    mechonPeloDer.computeVertexNormals();
    var mechonPeloDerBrush = new CSG.Brush(mechonPeloDer,material_rojo);

    
    //--------------------------------------------------------------------------------------
    var evaluador = new CSG.Evaluator();

    //cabeza
    var cabezaCuello = evaluador.evaluate(cuelloBrush,cabezaBrush, CSG.ADDITION);
    var mascaraInt = evaluador.evaluate(mascaraBrush,cilMascaraIntBrush, CSG.SUBTRACTION);
    var mascara = evaluador.evaluate(mascaraInt,cilMascaraExtBrush, CSG.INTERSECTION);
    var cabezaMascara = evaluador.evaluate(mascara,cabezaCuello, CSG.ADDITION);

    var peloRec1 = evaluador.evaluate(peloBrush,recPeloBrush, CSG.INTERSECTION);
    var peloRec2 = evaluador.evaluate(peloRec1,recPelo2Brush, CSG.SUBTRACTION);
    var peloMechon = evaluador.evaluate(peloRec2,mechonPeloBrush, CSG.ADDITION);
    var pelo = evaluador.evaluate(peloMechon,mechonPeloDerBrush, CSG.ADDITION);
    var cabeza = evaluador.evaluate(cabezaMascara,pelo, CSG.ADDITION);

    cabeza.geometry.translate(0,0.25,0);

    //cuerpo
    var torsoRecorte1 = evaluador.evaluate(torsoBaseBrush, recorteTorsoBrush,CSG.INTERSECTION);
    
    var ajusteRecorteAtras = evaluador.evaluate(recorteAtrasTorsoBrsuh,ajusteRecorteAtrasBrush, CSG.ADDITION);
    var torsoRecorte2 = evaluador.evaluate(ajusteRecorteAtras,torsoRecorte1, CSG.INTERSECTION);
    var claviculas = evaluador.evaluate(torsoRecorte2,claviculasBrush, CSG.ADDITION);
    
    var cuerpo = evaluador.evaluate(abdomenBrush,claviculas, CSG.ADDITION);

    //cabeza + cuerpo
    var cabezaCuerpo = evaluador.evaluate(cuerpo,cabeza, CSG.ADDITION);
    cabezaCuerpo.geometry.translate(0,0.35,0);

    //falda
    var faldaBase = evaluador.evaluate(faldaExtBrush, faldaIntBrush, CSG.SUBTRACTION);
    var falda = evaluador.evaluate(faldaBase, faldaAperturaBrush, CSG.SUBTRACTION);

    //piernas
    var pieDer = evaluador.evaluate(pieBaseBrush, pieRecorteBrush, CSG.SUBTRACTION);
    var piernaDer = evaluador.evaluate(piernaEnteraBrush, pieDer, CSG.ADDITION);

    var piernaIzq = piernaDer.geometry.clone();
    piernaIzq.translate(0.07,0,0);
    var piernaIzqBrush = new CSG.Brush(piernaIzq,material_rojo);

    var piernas = evaluador.evaluate(piernaDer, piernaIzqBrush, CSG.ADDITION);
    var faldaPiernas = evaluador.evaluate(falda, piernas, CSG.ADDITION);

    //cuerpo sin brazos
    var reina = evaluador.evaluate(cabezaCuerpo, faldaPiernas, CSG.ADDITION);

    return reina.geometry.clone();
  }

crearAnimacion(distancia = 5) {
  return new Promise(resolve => {
  //Pose inicial
  const orig = {
    j1z: this.joint1.rotation.z,
    j1x: this.joint1.rotation.x,
    j1y: this.joint1.rotation.y,
    j2z: this.joint2.rotation.z,
    j2x: this.joint2.rotation.x,
    j3x: this.joint3.rotation.x,
    j1Bz: this.joint1B.rotation.z,
    j1Bx: this.joint1B.rotation.x,
    j1By: this.joint1B.rotation.y,
    j2Bz: this.joint2B.rotation.z,
    j2Bx: this.joint2B.rotation.x,
    j3Bx: this.joint3B.rotation.x,
    s4: this.joint4.scale.x,
    s4B: this.joint4B.scale.x,
    p4z: this.joint4.position.z,
    p4Bz: this.joint4B.position.z
  };

  // E1
  const poseE1 = {
    ...orig,
    j1z:  70 * Math.PI / 180,
    j2z: -70 * Math.PI / 180,
    j1Bz:-70 * Math.PI / 180,
    j2Bz: 70 * Math.PI / 180
  };

  // E2
  const poseE2 = {
    ...poseE1,
    s4:  10,
    s4B: 10
  };

  // E3
  const poseE3 = {
    ...poseE2,
    j3x:  -60 * Math.PI/180,
    j3Bx: -60 * Math.PI/180,
    j2z:  -40 * Math.PI/180,
    j2Bz:  40 * Math.PI/180,
    j1x:   60 * Math.PI/180,
    j1Bx:  60 * Math.PI/180,
    j1y:   30 * Math.PI/180,
    j1By: -30 * Math.PI/180
  };

  // E4 
  const poseE4 = {
    ...poseE3,
    p4z:  orig.p4z + distancia,
    p4Bz: orig.p4Bz + distancia
  };

  // TWEENS
  const t1 = new TWEEN.Tween({ ...orig })
    .to(poseE1, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(v => {
      this.joint1.rotation.z  = v.j1z;
      this.joint2.rotation.z  = v.j2z;
      this.joint1B.rotation.z = v.j1Bz;
      this.joint2B.rotation.z = v.j2Bz;
    });

  const t2 = new TWEEN.Tween({ ...poseE1 })
    .to(poseE2, 600)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(v => {
      this.joint4.scale.set(v.s4, v.s4, v.s4);
      this.joint4B.scale.set(v.s4B, v.s4B, v.s4B);
    });

  const t3 = new TWEEN.Tween({ ...poseE2 })
    .to(poseE3, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(v => {
      this.joint3.rotation.x   = v.j3x;
      this.joint3B.rotation.x  = v.j3Bx;
      this.joint2.rotation.z   = v.j2z;
      this.joint2B.rotation.z  = v.j2Bz;
      this.joint1.rotation.x   = v.j1x;
      this.joint1B.rotation.x  = v.j1Bx;
      this.joint1.rotation.y   = v.j1y;
      this.joint1B.rotation.y  = v.j1By;
    });

  const t4 = new TWEEN.Tween({ ...poseE3 })
    .to(poseE4, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(v => {
      this.joint4.position.z  = v.p4z;
      this.joint4B.position.z = v.p4Bz;
    });

  const t5 = new TWEEN.Tween({ ...poseE4 })
    .to(orig, 1000)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(v => {
      this.joint1.rotation.set(v.j1x, v.j1y, v.j1z);
      this.joint2.rotation.set(v.j2x, 0, v.j2z);
      this.joint3.rotation.x  = v.j3x;
      this.joint1B.rotation.set(v.j1Bx, v.j1By, v.j1Bz);
      this.joint2B.rotation.set(v.j2Bx, 0, v.j2Bz);
      this.joint3B.rotation.x = v.j3Bx;
      this.joint4.scale.set(v.s4, v.s4, v.s4);
      this.joint4B.scale.set(v.s4B, v.s4B, v.s4B);
      this.joint4.position.z  = v.p4z;
      this.joint4B.position.z = v.p4Bz;
    });

    t5.onComplete(() => resolve())

  // Cadena de tweens
  t1.chain(t2);
  t2.chain(t3);
  t3.chain(t4);
  t4.chain(t5);
  t1.start();
  })
}


  createShapeFalda(){
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 0.38);
    shape.quadraticCurveTo(0.1,0.38,0.1,0.25);
    shape.quadraticCurveTo(0.1,0.1,0.22,0);
    shape.lineTo(0, 0); 
    return shape;
  }

  createShapeFaldaApertura(){
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.1, 0);
    shape.quadraticCurveTo(0.01,0.1,0,0.3);
    shape.quadraticCurveTo(-0.01,0.1,-0.1,0);
    shape.lineTo(0, 0); 
    return shape;
  }

  createShapeAbdomen(){
    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.05, 0);
    shape.quadraticCurveTo(0.025, 0.04, 0.058, 0.14);
    shape.lineTo(0, 0.14);
    return shape;
  }

  createShapeBaseTorso(){
    var shape = new THREE.Shape();
    shape.moveTo(0.06, 0.14);
    shape.quadraticCurveTo(0.085, 0.16, 0.075, 0.19);
    shape.quadraticCurveTo(0.06, 0.21, 0.04, 0.23);
    shape.quadraticCurveTo(0.018, 0.25, 0.02, 0.25);
    shape.lineTo(0, 0.26); 
    return shape;
  }

  createShapeRecorteTorso() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.14);
  shape.lineTo(0.06, 0.14);
  shape.quadraticCurveTo(0.065, 0.19, 0.065, 0.25);
  shape.lineTo(0, 0.26);
  shape.lineTo(-0.065,0.25);
  shape.quadraticCurveTo(-0.065,0.19,-0.058,0.14);
  shape.lineTo(0,0.14);
  return shape;
}

createShapeClaviculas() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.2);
  shape.lineTo(0.04, 0.2);
  shape.quadraticCurveTo(0.04, 0.25, 0, 0.26);
  shape.quadraticCurveTo(-0.04, 0.25, -0.04, 0.2);
  shape.lineTo(0, 0.2);
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

createShapeMascara(){
  var shape = new THREE.Shape();
  shape.moveTo(0, 0.115);
  shape.lineTo(0.008, 0.115);
  shape.lineTo(0.005, 0.107);
  shape.quadraticCurveTo(0.055, 0.135, 0.034, 0.065);
  shape.quadraticCurveTo(0.055, 0.095, 0.04, 0.145);
  shape.quadraticCurveTo(0.04, 0.135, 0.03, 0.125);
  shape.quadraticCurveTo(0.015, 0.135, 0, 0.125);
  shape.quadraticCurveTo(-0.015, 0.135, -0.03, 0.125);
  shape.quadraticCurveTo(-0.04, 0.135, -0.04, 0.145);
  shape.quadraticCurveTo(-0.055, 0.095, -0.034, 0.065);
  shape.quadraticCurveTo(-0.055, 0.135, -0.005, 0.107);
  shape.lineTo(-0.008, 0.115);
  shape.lineTo(0, 0.115);
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
export { Reina }