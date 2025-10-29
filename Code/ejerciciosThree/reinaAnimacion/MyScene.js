
import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.module.js';
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

import { Reina } from './reina.js'

class MyScene extends THREE.Scene {
  constructor (myCanvas) { 
    super();
    this.renderer = this.createRenderer(myCanvas);
    this.gui = this.createGUI ();

    this.createLights ();
    this.createCamera ();
    //this.createGround ();
    this.axis = new THREE.AxesHelper (50);
    this.add (this.axis);

    this.reina = new Reina(this.gui, "Reina");
    this.add(this.reina);
  }
  
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.camera.position.set (2, 1, 2);
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);

    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);

    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;

    this.cameraControl.target = look;
  }
  
  createGround () {
    var geometryGround = new THREE.BoxGeometry (0.5,0.02,0.5);
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial ({map: texture});
    var ground = new THREE.Mesh (geometryGround, materialGround);
    ground.position.y = -0.01;
    this.add (ground);
  }
  
  createGUI () {
  var gui = new GUI();
  this.guiControls = {
    lightPower       : 50.0,
    ambientIntensity : 0.5,
    axisOnOff        : true,
    // 1) Definimos la función que lanza la animación:
    animarReina      : () => {
      // Puedes pasarle un parámetro de distancia si quieres:
      this.reina.crearAnimacion(1);
    }
  }

  var folder = gui.addFolder('Luz y Ejes');
  folder.add(this.guiControls, 'lightPower', 0, 1000, 20)
    .name('Luz puntual : ')
    .onChange(v => this.setLightPower(v));
  folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
    .name('Luz ambiental: ')
    .onChange(v => this.setAmbientIntensity(v));
  folder.add(this.guiControls, 'axisOnOff')
    .name('Mostrar ejes : ')
    .onChange(v => this.setAxisVisible(v));

  // 2) Aquí añadimos el botón:
  folder.add(this.guiControls, 'animarReina')
    .name('▶ Animar Reina');

  return gui;
}

  
  createLights () {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add (this.ambientLight);

    this.pointLight = new THREE.SpotLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 3, 1 );
    console.log (this.pointLight);
    this.add (this.pointLight);
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
    this.reina.update();
    requestAnimationFrame(() => this.update())
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener ("resize", () => scene.onWindowResize());

  scene.update();
});
