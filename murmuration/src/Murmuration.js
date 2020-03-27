import {useEffect} from 'react';
import * as THREE from 'three'

export default function Murmuration(props) {
  useEffect(() => {
    runTest();
  }, []);

  function runTest() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    let camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 5000);
    camera.position.z = 1000;

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight - 25);
    document.body.appendChild( renderer.domElement );

    let numParticles = 5000;
    let vertices = [];
    let scales = new Float32Array(numParticles);

    for (let i = 0; i < numParticles; i++) {
      let x = THREE.MathUtils.randFloatSpread(500);
      let y = THREE.MathUtils.randFloatSpread(500);
      let z = THREE.MathUtils.randFloatSpread(1000);

      // scales[ i ] = 10;
      vertices.push(x, y, z);
    }

    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    // geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // let material = new THREE.PointsMaterial( { color: 0x888888 } );

    let material = new THREE.ShaderMaterial({
      uniforms: {
        color: {value: new THREE.Color(0x000000)},
      },
      fragmentShader: fragmentShader(),
      vertexShader: vertexShader(),
    });
    material.transparent = true;

    let points = new THREE.Points(geometry, material);

    scene.add(points);

    // let geometry = new THREE.BoxGeometry();
    // let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // let cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    // camera.position.z = 5;

    let animate = function () {
      requestAnimationFrame(animate);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };


    // attribute float scale;
    function vertexShader() {
      return `
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 10.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

        }
      `
    }

    function fragmentShader() {
      return `
        uniform vec3 color;

        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475)
            discard;
          gl_FragColor = vec4(color, 0.5);

        }
      `
    }


    animate();
  }

  return null;
}