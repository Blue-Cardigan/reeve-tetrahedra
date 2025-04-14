'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
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

  // Calculate a suitable center point for the annotation
  const centerPoint = useMemo(() => {
      const avgX = (0 + 1 + 0 + 1) / 4;
      const avgY = (0 + 0 + 1 + 1) / 4;
      const avgZ = (0 + 0 + 0 + r) / 4;
      return new THREE.Vector3(avgX, avgY, avgZ + Math.max(1, r * 0.3)); // Position above the center
  }, [r]);

  return (
    <Canvas camera={{ position: [3, 3, Math.max(5, r * 2)], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />

      {/* Render the faces */}
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#00ced1" side={THREE.DoubleSide} transparent opacity={0.6} wireframe={false} />
      </mesh>

      {/* Render the edges */}
      {edges.map((edge, i) => (
         <Line key={`edge-${i}`} points={edge} color="#333333" lineWidth={2.5} />
      ))}

      {/* Render Vertices as distinct spheres */}
      {vertices.map((vertex, i) => (
          <Sphere key={`vertex-${i}`} args={[0.08, 16, 16]} position={vertex}>
              <meshStandardMaterial color="gold" />
          </Sphere>
      ))}

      {/* Render ALL calculated Z1 lattice points */}
      {latticePoints.map((p, i) => {
        // Skip rendering points that exactly match the main vertices (already rendered)
        if (vertices.some(vtx => vtx.equals(p.position))) {
          return null;
        }
        
        let color = 'lightgray';
        let opacity = 0.15;
        let size = 0.04;

        if (p.location === 'Boundary') {
           color = 'gold'; // Boundary points (non-vertex, if any) also gold
           opacity = 0.8;
           size = 0.05; // Slightly larger than interior
        } else if (p.location === 'Interior') {
           color = '#4682b4'; // Blue for interior
           opacity = 1.0;
           size = 0.04;
        }

        return (
          <Sphere key={`lattice-${i}`} args={[size, 16, 16]} position={p.position}>
             <meshStandardMaterial color={color} transparent={p.location === 'Outside'} opacity={opacity} />
          </Sphere>
        );
      })}

      <axesHelper args={[Math.max(1.5, r * 0.6)]} />
      <OrbitControls />
    </Canvas>
  );
};

export default ReeveTetrahedronViz;
