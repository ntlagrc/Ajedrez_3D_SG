
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.module.js';
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

import { Board } from './tablero.js'
import { Peon } from './peon.js';
import { Torre } from './torre.js';
import { Caballo } from './caballo.js';
import { Alfil } from './alfil.js';
import { Reina } from './reina.js';
import { Rey } from './rey.js';
import { Farola } from './farola.js';

class MyScene extends THREE.Scene {
  constructor (myCanvas) { 
    super();
    // Estado del juego
    this.boardState = Array(8).fill(null).map(() => Array(8).fill(null));   //tablero
    this.turn = 'white';               // jugador activo
    this.selectedPiece = null;         // pieza actualmente seleccionada
    this.highlightMeshes = [];         // meshes de casillas resaltadas
    this.pieceMeshes = [];             // meshes de piezas para picking
    this.capturedWhite = [];           // piezas capturadas lado blanco
    this.capturedBlack = [];           // piezas capturadas lado negro
  

    this.renderer = this.createRenderer(myCanvas);
    this.gui      = this.createGUI();

    this.createLights();
    this.createCamera();
    this.createGround();
    this.createBoard(); 
    this.createFarolas();
    this.colocaPiezas();

    this.axis = new THREE.AxesHelper(50);
    this.add(this.axis);

    this.cameraRadius = 5;  
    this.cameraAngle = Math.PI; 

    // picking
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.highlightGroup = new THREE.Group();
    this.add(this.highlightGroup);

    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
  }

  onPointerDown(event) {
    // coords normalizadas
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    // comprobamos si clickeamos en un highlight
    const hitsHL = this.raycaster.intersectObjects(this.highlightMeshes, false);
    if (hitsHL.length > 0 && this.selectedPiece) {
      const hl = hitsHL[0].object;
      const to = hl.userData; 
      const from = { row: this.selectedPiece.row, col: this.selectedPiece.col };
      this.updateBoardState(from, to);
      this.clearHighlights();
      this.selectedPiece = null;
      this.reinaLight.visible = false;
      this.turn = (this.turn === 'white') ? 'black' : 'white';
      this.switchCamera();
      return;
    }

    // Picking de piezas
    const hits = this.raycaster.intersectObjects(this.pieceMeshes, false);
    if (hits.length === 0) return;

    const meshHit = hits[0].object;
    const piece = meshHit.userData.piece;
    if (!piece || piece.color !== this.turn) return;

    this.clearHighlights();
    this.selectedPiece = piece;
    const moves = piece.getValidMoves(this.boardState);
    this.colocaHighlights(moves);

    if (piece instanceof Reina) {
      this.reinaLight.visible = true;
      this.reinaLight.position.set(piece.position.x, piece.position.y + 5, piece.position.z);
      this.reinaLight.target.position.set(piece.position.x, piece.position.y, piece.position.z);
    } else {
      this.reinaLight.visible = false;
    }
  }

  //casillas disponibles para una pieza
  colocaHighlights(moves) {
    const s     = this.board.casillaSize;
    const halfW = this.board.cols * s / 2;
    const halfH = this.board.rows * s / 2;
    moves.forEach(m => {
      const geom = new THREE.CircleGeometry(s * 0.45, 32);
      const mat  = new THREE.MeshBasicMaterial({color: 0x00ff00, opacity: 0.5, transparent: true});
      const mesh = new THREE.Mesh(geom, mat);
      const x = m.col * s - halfW + s/2;
      const z = m.row * s - halfH + s/2;
      mesh.rotation.x = -Math.PI/2;
      mesh.position.set(x, 0.01, z);
      mesh.userData = { row: m.row, col: m.col };
      this.highlightGroup.add(mesh);
      this.highlightMeshes.push(mesh);
    });
  }

  clearHighlights() {
    this.highlightMeshes.forEach(h => this.highlightGroup.remove(h));
    this.highlightMeshes = [];
  }

  
  createCamera () {
  this.cameraRadius = 5;               
  this.cameraAngle = Math.PI;          //lado blanco

  const x = this.cameraRadius * Math.sin(this.cameraAngle);
  const z = this.cameraRadius * Math.cos(this.cameraAngle);

  this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
  this.camera.position.set(x, 5, z);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  this.add(this.camera);

  this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
  this.cameraControl.rotateSpeed = 5;
  this.cameraControl.zoomSpeed = -2;
  this.cameraControl.panSpeed = 0.5;
  this.cameraControl.target = new THREE.Vector3(0, 0, 0);
}


// cambio de camara despues de un turno
  switchCamera() {
    const startAngle = this.cameraAngle;
    const endAngle = (this.cameraAngle === Math.PI) ? 0 : Math.PI; 
    const angleObj = { theta: startAngle };

    new TWEEN.Tween(angleObj)
      .to({ theta: endAngle }, 1500) 
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.cameraAngle = angleObj.theta;
        const x = this.cameraRadius * Math.sin(this.cameraAngle);
        const z = this.cameraRadius * Math.cos(this.cameraAngle);
        this.camera.position.set(x, 5, z);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      })
      .onComplete(() => {
        this.cameraAngle = endAngle;
      })
      .start();
  }

  // suelo
  createGround () {
    const loader = new THREE.TextureLoader();

    const colorTex = loader.load('../imgs/Bricks_Color.jpg');
    const normalTex = loader.load('../imgs/Bricks_Normal.jpg');

    colorTex.wrapS = colorTex.wrapT = THREE.RepeatWrapping;
    normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;

    colorTex.repeat.set(4, 4);
    normalTex.repeat.set(4, 4);

    const materialGround = new THREE.MeshStandardMaterial({
      map: colorTex,
      normalMap: normalTex,
      metalness: 0.2,
      roughness: 1.0
    });

    const geometryGround = new THREE.BoxGeometry(8,8, 0.1);
    const ground = new THREE.Mesh(geometryGround, materialGround);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;

    this.add(ground);
  }

  // tablero
  createBoard() {
    this.board = new Board(0.5, 8, 8);
    this.add(this.board);
  }

  //decoracion farolas
  createFarolas(){
    var material_gris_oscuro = new THREE.MeshStandardMaterial({color: 0x444444,side: THREE.DoubleSide});
    
    this.farola = new Farola(material_gris_oscuro);
    this.farola.position.set(3,-0.05,2.5);
    this.add(this.farola);
    this.fLight = new THREE.PointLight(0xffffff, 1, 10);
    this.fLight.position.set(3,1.46,2.5);
    this.add(this.fLight);

    this.farola1 = new Farola(material_gris_oscuro);
    this.farola1.position.set(3,-0.05,-2.5);
    this.add(this.farola1);
    this.fLight2 = new THREE.PointLight(0xffffff, 1, 10);
    this.fLight2.position.set(3,1.46,-2.5);
    this.add(this.fLight2);

    this.farola2 = new Farola(material_gris_oscuro);
    this.farola2.position.set(-3,-0.05,2.5);
    this.add(this.farola2);
    this.fLight3 = new THREE.PointLight(0xffffff, 3, 10);
    this.fLight3.position.set(-3,1.46,2.5);
    this.add(this.fLight3);
    

    this.farola3 = new Farola(material_gris_oscuro);
    this.farola3.position.set(-3,-0.05,-2.5);
    this.add(this.farola3);
    this.fLight3 = new THREE.PointLight(0xffffff, 3, 10);
    this.fLight3.position.set(-3,1.46,-2.5);
    this.add(this.fLight3);
  }

  //colocar piezas posicion inicial
  colocaPiezas() {
    const s     = this.board.casillaSize;
    const halfW = this.board.cols * s / 2;
    const halfH = this.board.rows * s / 2;
    const y0    = 0;
    const matBlanco = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const matNegro  = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const zPos = row => row * s - halfH + s/2;
    
    const place = (PieceClass, material, col, row, isBlack=false) => {
      const x     = col * s - halfW + s/2;
      const z     = zPos(row);
      const piece = new PieceClass(material);
      piece.col   = col;
      piece.row   = row;
      piece.color = isBlack ? 'black' : 'white';
      this.boardState[row][col] = piece;
      piece.position.set(x, y0, z);
      if (isBlack) piece.rotation.y = Math.PI;
      this.add(piece);
      piece.traverse(child => {
        if (child.isMesh) {
          child.userData.piece = piece;
          this.pieceMeshes.push(child);
        }
      });
    };
    const placeTorre = (material, col, row, isBlack=false) => {
      const x     = col * s - halfW + s/2;
      const z     = zPos(row);
      const torre = new Torre(material, (pieza) => {
        pieza.traverse(child => {
          if (child.isMesh) {
            this.pieceMeshes.push(child);
          }
        });
      });
      torre.col   = col;
      torre.row   = row;
      torre.color = isBlack ? 'black' : 'white';
      this.boardState[row][col] = torre;
      torre.position.set(x, y0, z);
      if (isBlack) torre.rotation.y = Math.PI;
      this.add(torre);
    };

    // Peones
    for (let c = 0; c < 8; c++) {
      place(Peon,   matBlanco, c, 1, false);
      place(Peon,   matNegro,  c, 6, true);
    }
    // Torres
    [0,7].forEach(c => {
      placeTorre(matBlanco, c, 0, false);
      placeTorre(matNegro,  c, 7, true);
    });
    // Caballos
    [1,6].forEach(c => {
      place(Caballo, matBlanco, c, 0, false);
      place(Caballo, matNegro,  c, 7, true);
    });
    // Alfiles
    [2,5].forEach(c => {
      place(Alfil, matBlanco, c, 0, false);
      place(Alfil, matNegro,  c, 7, true);
    });
    // Reina y Rey
    place(Reina, matBlanco, 3, 0, false);
    place(Rey,   matBlanco, 4, 0, false);
    place(Reina, matNegro,  3, 7, true);
    place(Rey,   matNegro,  4, 7, true);
  }

  /*
  debugValidMoves() {
  // Peón blanco inicial en (4,0)
  const pawn = this.boardState[4][0];
  console.log('Valid moves para Peón blanco en (4,0):', pawn.getValidMoves(this.boardState));
  
  // Peón negro inicial en (6,7)
  const pawnB = this.boardState[6][7];
  console.log('Valid moves para Peón negro en (6,7):', pawnB.getValidMoves(this.boardState));
  
  // Torre blanca inicial en (0,0)
  const rook = this.boardState[0][0];
  console.log('Valid moves para Torre blanca en (0,0):', rook.getValidMoves(this.boardState));
  
  // Alfil blanco inicial en (0,2)
  const bishop = this.boardState[0][2];
  console.log('Valid moves para Alfil blanco en (0,2):', bishop.getValidMoves(this.boardState));
  
  // Caballo blanco inicial en (0,1)
  const knight = this.boardState[0][1];
  console.log('Valid moves para Caballo blanco en (0,1):', knight.getValidMoves(this.boardState));

    // Reina blanco inicial en (0,4)
  const reina = this.boardState[0][4];
  console.log('Valid moves para Reina blanco en (0,4):', reina.getValidMoves(this.boardState));

    // Rey blanco inicial en (0,3)
  const rey = this.boardState[0][3];
  console.log('Valid moves para Rey blanco en (0,3):', rey.getValidMoves(this.boardState));
}*/

// actualizar tablero despues de un movimiento + animaciones
updateBoardState(from, to) {
  const { row: r0, col: c0 } = from;
  const { row: r1, col: c1 } = to;
  const moving = this.boardState[r0][c0];
  if (!moving) return;
  const victim = this.boardState[r1][c1];

  // Distancia para el ataque de Reina
  const dr = r1 - r0, dc = c1 - c0;
  const distancia = Math.max(Math.abs(dr), Math.abs(dc));

  // Cálculo de la posición destino
  const s     = this.board.casillaSize;
  const halfW = this.board.cols * s/2;
  const halfH = this.board.rows * s/2;
  const xDest = c1*s - halfW + s/2;
  const zDest = r1*s - halfH + s/2;
  const targetPos = { x: xDest, y: moving.position.y, z: zDest };

  if (victim) {
    victim.traverse(c => {
      if (c.isMesh) {
        this.pieceMeshes = this.pieceMeshes.filter(m => m !== c);
      }
    });

    // Caso no es reina
    if (!(moving instanceof Reina)) {
      const list = victim.color === 'white' ? this.capturedWhite : this.capturedBlack;
      const destino = this.getCapturedPosition(victim.color === 'black', list.length);
      list.push(victim);
      this.animateDead(victim, destino);
      

      this.boardState[r0][c0] = null;
      this.boardState[r1][c1] = moving;
      moving.row = r1; moving.col = c1;
      this.animateMove(moving, targetPos, 0.7, 1000);
      return;
    }

    // es reina
    const originalRotY = moving.rotation.y;
    const victimPos    = victim.position.clone();

    new TWEEN.Tween(moving.rotation)
      .to({
        y: Math.atan2(
          victimPos.x - moving.position.x,
          victimPos.z - moving.position.z
        )
      }, 300)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onComplete(() => {
        moving.crearAnimacion(distancia).then(() => {
          const list = victim.color === 'white' ? this.capturedWhite : this.capturedBlack;
          const destino = this.getCapturedPosition(victim.color === 'black', list.length);
          list.push(victim);
          this.animateDead(victim, destino);

          this.boardState[r0][c0] = null;
          this.boardState[r1][c1] = moving;
          moving.row = r1; moving.col = c1;

          this.animateMove(moving, targetPos, 0.7, 1500).then(() => {
            new TWEEN.Tween(moving.rotation)
              .to({ y: originalRotY }, 300)
              .easing(TWEEN.Easing.Quadratic.InOut)
              .start();
          });
        });
      })
      .start();

  } else {
    // Movimiento sin captura
    this.boardState[r0][c0] = null;
    this.boardState[r1][c1] = moving;
    moving.row = r1; moving.col = c1;
    this.animateMove(moving, targetPos, 0.7, 1000);
  }
}

//animacion movimiento normal
animateMove(piece, targetPos, liftHeight = 1, duration = 600) {
  const original = { x: piece.position.x, y: piece.position.y, z: piece.position.z };
  const liftDur = duration * 0.2;
  const moveDur = duration * 0.6;
  const dropDur = duration * 0.2;

  return new Promise(resolve => {
    const upTween = new TWEEN.Tween(piece.position)
      .to({ x: original.x, y: original.y + liftHeight, z: original.z }, liftDur)
      .easing(TWEEN.Easing.Quadratic.Out);

    const moveTween = new TWEEN.Tween(piece.position)
      .to({ x: targetPos.x, y: original.y + liftHeight, z: targetPos.z }, moveDur)
      .easing(TWEEN.Easing.Quadratic.InOut);

    const downTween = new TWEEN.Tween(piece.position)
      .to({ x: targetPos.x, y: original.y, z: targetPos.z }, dropDur)
      .easing(TWEEN.Easing.Quadratic.In)
      .onComplete(() => resolve());

    upTween.chain(moveTween);
    moveTween.chain(downTween);

    upTween.start();
  });
}

//animacion pieza capturada
animateDead(piece, targetPos, duration = 500) {
  return new Promise(resolve => {
    new TWEEN.Tween(piece.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        const targetRotationY = piece.color === 'black' ? Math.PI / 2 : -Math.PI / 2;

        new TWEEN.Tween(piece.rotation)
          .to({ y: targetRotationY }, 400)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onComplete(() => resolve())
          .start();
      })
      .start();
  });
}


// Para saber donde se coloca la siguiente pieza capturada
getCapturedPosition(isBlack, count) {
  const baseX = isBlack ? -2.5 : 2.5; 
  const baseZ = -1.8; 
  const spacingZ = 0.5; 
  const spacingX = 0.5; 

  const maxPerRow = 8;
  const row = Math.floor(count / maxPerRow);
  const indexInRow = count % maxPerRow;

  const offsetX = isBlack ? baseX - row * spacingX : baseX + row * spacingX; 
  const offsetZ = baseZ + indexInRow * spacingZ;

  return { x: offsetX, y: 0, z: offsetZ };
}

  
  createGUI () {
    var gui = new GUI();
    this.guiControls = {
      lightPower : 50.0,
      ambientIntensity : 0.5,   
      axisOnOff : true
    }

    var folder = gui.addFolder ('Luz y Ejes');
    folder.add (this.guiControls, 'lightPower', 0, 1000, 20)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
      
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);

    this.pointLight = new THREE.SpotLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(2, 5, 2);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width  = 1024;
    this.pointLight.shadow.mapSize.height = 1024;
    this.add(this.pointLight);

    // Luz azul lado blancas
    this.blueLight = new THREE.PointLight(0x0000ff, 15, 20);
    this.blueLight.position.set(0, 2, -2); 
    this.add(this.blueLight);

    // Luz morada lado negras
    this.purpleLight = new THREE.PointLight(0x800080, 20, 20);
    this.purpleLight.position.set(0, 2, 2); 
    this.add(this.purpleLight);

    this.reinaLight = new THREE.SpotLight(0xff0000, 10, 10, Math.PI / 6, 0.5, 1.0);
    this.reinaLight.visible = false;
    this.reinaLight.castShadow = true;
    this.reinaLight.position.set(0, 10, 0);
    this.reinaLight.target.position.set(0, 0, 0);
    this.add(this.reinaLight);
    this.add(this.reinaLight.target);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
    
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    TWEEN.update();
    this.renderer.render (this, this.getCamera());
    this.cameraControl.update();
  requestAnimationFrame(() => this.update());
  }
}


$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());

  var path = "../imgs/dayCity_skybox";
  var format = '.png';
  var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
  ];
  var textureCube = new THREE.CubeTextureLoader().load(urls);
  scene.background = textureCube;


  scene.update();
});
