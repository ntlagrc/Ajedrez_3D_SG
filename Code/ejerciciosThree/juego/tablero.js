import * as THREE from '../libs/three.module.js';

class Board extends THREE.Object3D {
  constructor(casillaSize = 0.5, rows = 8, cols = 8) {
    super();
    this.casillaSize = casillaSize;
    this.rows = rows;
    this.cols = cols;
    this.buildBoard();
  }
  
  buildBoard() {
    const altura = 0.05;                      
    const halfW     = this.cols * this.casillaSize / 2;
    const halfH     = this.rows * this.casillaSize / 2;
    const geom      = new THREE.BoxGeometry(this.casillaSize, altura, this.casillaSize);
    
    // Texturas marmol claro/oscuro
    const loader = new THREE.TextureLoader();
    const texWhite = loader.load('../imgs/marmol-blanco.jpg');
    const texBlack = loader.load('../imgs/marmol-negro2.jpg');

    const matWhite = new THREE.MeshStandardMaterial({ map: texWhite });
    const matBlack = new THREE.MeshStandardMaterial({ map: texBlack });
    
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const isBlack = (i + j) % 2 === 0;
        const mat = isBlack ? matBlack : matWhite;
        const square = new THREE.Mesh(geom, mat);
        // centramos en (0,0,0)
        square.position.x = j * this.casillaSize - halfW + this.casillaSize/2;
        square.position.z = i * this.casillaSize - halfH + this.casillaSize/2;
        square.position.y = -altura/2;
        square.receiveShadow = true;
        this.add(square);
      }
    }
  }
}

export { Board };
