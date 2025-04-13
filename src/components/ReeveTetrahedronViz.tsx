'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { checkPointLocation } from '@/lib/geometryUtils'; // Import helper

interface ReeveTetrahedronVizProps {
  r: number;
}

const ReeveTetrahedronViz: React.FC<ReeveTetrahedronVizProps> = ({ r }) => {

  const { vertices, edges, geometry, latticePoints } = useMemo(() => {
    const v = [
      new THREE.Vector3(0, 0, 0), // A (Origin)
      new THREE.Vector3(1, 0, 0), // B
      new THREE.Vector3(0, 1, 0), // C
      new THREE.Vector3(1, 1, r), // D
    ];

    const geom = new THREE.BufferGeometry().setFromPoints(v);
    geom.setIndex([0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3]);
    geom.computeVertexNormals();

    const edgs = [
        [v[0], v[1]], [v[0], v[2]], [v[1], v[2]],
        [v[0], v[3]], [v[1], v[3]], [v[2], v[3]],
    ];

    // Generate nearby Z1 lattice points
    const points: { position: THREE.Vector3; location: 'Interior' | 'Boundary' | 'Outside' }[] = [];
    const range = 1.5; // How far around the base to show points
    const minX = -range;
    const maxX = range + 1;
    const minY = -range;
    const maxY = range + 1;
    const minZ = -range;
    const maxZ = Math.max(range, r + range);

    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
        for (let z = Math.floor(minZ); z <= Math.ceil(maxZ); z++) {
          const p = new THREE.Vector3(x, y, z);
          const location = checkPointLocation(p, v[0], v[1], v[2], v[3]);
          points.push({ position: p, location });
        }
      }
    }

    return { vertices: v, edges: edgs, geometry: geom, latticePoints: points };

  }, [r]);

  return (
    <Canvas camera={{ position: [2, 2, Math.max(3, r * 1.5)], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1} />

      {/* Render the faces */}
      <mesh geometry={geometry}>
        <meshStandardMaterial color="skyblue" side={THREE.DoubleSide} transparent opacity={0.5} wireframe={false} />
      </mesh>

      {/* Render the edges */}
      {edges.map((edge, i) => (
         <Line key={`edge-${i}`} points={edge} color="black" lineWidth={2} />
      ))}

      {/* Render Z1 lattice points */}
      {latticePoints.map((p, i) => (
        <Sphere key={`lattice-${i}`} args={[0.04, 16, 16]} position={p.position}>
           {/* Grey for outside, blue for inside/boundary */}
           <meshStandardMaterial color={p.location === 'Outside' ? 'lightgray' : 'blue'} transparent={p.location === 'Outside'} opacity={p.location === 'Outside' ? 0.4 : 1.0} />
        </Sphere>
      ))}

      <axesHelper args={[Math.max(1.5, r * 0.5)]} />
      <OrbitControls />
    </Canvas>
  );
};

export default ReeveTetrahedronViz;
