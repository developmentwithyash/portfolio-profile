/**
 * YASH — CINEMATIC WEBGL SCENE CONTROLLER
 * Three.js 3D Volumetric Atmosphere, Camera Scrubbing & Golden Particle Nexus
 */

import * as THREE from './vendor/three.module.js';

export class CinematicWebGLScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.isReducedMotion) {
      this.canvas.style.display = 'none';
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 18);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.particles = null;
    this.nexusCore = null;
    this.nexusOuter = null;
    this.grid = null;
    this.targetScrollProgress = 0;
    this.currentScrollProgress = 0;

    this.initLighting();
    this.initNexusGeometry();
    this.initGoldenParticles();
    this.initDepthGrid();
    this.bindEvents();
    this.animate();
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.6);
    this.scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xFACC15, 2.5, 50);
    goldPointLight.position.set(0, 4, 10);
    this.scene.add(goldPointLight);

    const amberFill = new THREE.PointLight(0xEAB308, 1.8, 40);
    amberFill.position.set(-8, -4, -5);
    this.scene.add(amberFill);
  }

  initNexusGeometry() {
    const coreGeo = new THREE.IcosahedronGeometry(3.5, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x14151C,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: true,
      emissive: 0x92400E,
      emissiveIntensity: 0.4
    });
    this.nexusCore = new THREE.Mesh(coreGeo, coreMat);
    this.nexusCore.position.set(0, 0, 0);
    this.scene.add(this.nexusCore);

    const outerGeo = new THREE.TorusGeometry(5.2, 0.04, 16, 100);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xFDE047,
      transparent: true,
      opacity: 0.35
    });
    this.nexusOuter = new THREE.Mesh(outerGeo, outerMat);
    this.nexusOuter.rotation.x = Math.PI / 3;
    this.scene.add(this.nexusOuter);
  }

  initGoldenParticles() {
    const count = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      scales[i] = Math.random() * 0.8 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0xFACC15,
      size: 0.25,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  initDepthGrid() {
    const gridHelper = new THREE.GridHelper(60, 40, 0xCA8A04, 0x1A1B24);
    gridHelper.position.y = -7;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.22;
    this.grid = gridHelper;
    this.scene.add(this.grid);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.renderer || !this.camera) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /**
   * Deterministic progress controller called directly from GSAP ScrollTrigger timeline
   * @param {number} progress - Normalized scroll progress [0, 1]
   */
  setScrollProgress(progress) {
    this.targetScrollProgress = progress;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Smooth interpolation towards scroll progress
    this.currentScrollProgress += (this.targetScrollProgress - this.currentScrollProgress) * 0.08;
    const p = this.currentScrollProgress;

    // Camera Scrub Choreography
    // Scene 01 -> 02: Push forward through nexus
    if (p <= 0.3) {
      const t = p / 0.3;
      this.camera.position.z = 18 - t * 14;
      this.camera.position.y = t * 1.5;
      this.camera.rotation.y = t * 0.4;
      if (this.nexusCore) {
        this.nexusCore.scale.setScalar(1 + t * 0.8);
        this.nexusCore.rotation.y += 0.003;
        this.nexusCore.rotation.x += 0.002;
      }
    }
    // Scene 03 -> 04: Side pan through architecture & project worlds
    else if (p <= 0.75) {
      const t = (p - 0.3) / 0.45;
      this.camera.position.z = 4 - Math.sin(t * Math.PI) * 2;
      this.camera.position.x = Math.sin(t * Math.PI * 2) * 5;
      this.camera.position.y = 1.5 + Math.cos(t * Math.PI) * 2;
      this.camera.rotation.y = 0.4 + t * 1.2;

      if (this.nexusOuter) {
        this.nexusOuter.rotation.z += 0.005;
        this.nexusOuter.rotation.y += 0.004;
      }
    }
    // Scene 05 -> 07: Pull back into expansive finale cosmos
    else {
      const t = (p - 0.75) / 0.25;
      this.camera.position.z = 4 + t * 16;
      this.camera.position.x = (1 - t) * 5;
      this.camera.position.y = 3.5 - t * 3.5;
      this.camera.rotation.y = 1.6 - t * 1.6;
    }

    // Orbiting particles
    if (this.particles) {
      this.particles.rotation.y += 0.0008;
      this.particles.rotation.x = Math.sin(p * Math.PI) * 0.2;
    }

    // Grid scroll flow
    if (this.grid) {
      this.grid.position.z = (p * 20) % 2;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

