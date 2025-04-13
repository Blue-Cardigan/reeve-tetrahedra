'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import { checkPointLocation } from '@/lib/geometryUtils'; // Use shared helper

// Remove local helper functions (now in geometryUtils.ts)
// ... isPointOnSegment, isPointInTriangle, local checkPointLocation ...

interface PointData {
  position: THREE.Vector3;
  type: 'Z1' | 'Z2'; // Z2 includes Z1
  location: 'Interior' | 'Boundary' | 'Outside';
}

interface ReeveFormulaVizProps {
  r: number;
}

const ReeveFormulaViz: React.FC<ReeveFormulaVizProps> = ({ r }) => {
  const { vertices, edges, geometry, latticePoints, counts } = useMemo(() => {
    const v = [
      new THREE.Vector3(0, 0, 0), // A
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

    // Calculate lattice points within a bounding box
    const points: PointData[] = [];
    const range = 1.5; // How far around the base to show points
    const minX = -range;
    const maxX = range + 1;
    const minY = -range;
    const maxY = range + 1;
    const minZ = -range;
    const maxZ = Math.max(range, r + range);

    // Z1 points (Integers)
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
        for (let z = Math.floor(minZ); z <= Math.ceil(maxZ); z++) {
          const p = new THREE.Vector3(x, y, z);
          const location = checkPointLocation(p, v[0], v[1], v[2], v[3]);
          points.push({ position: p, type: 'Z1', location });
        }
      }
    }

    // Z2 points (Halves, excluding Z1)
    for (let x = Math.floor(minX * 2); x <= Math.ceil(maxX * 2); x++) {
      for (let y = Math.floor(minY * 2); y <= Math.ceil(maxY * 2); y++) {
        for (let z = Math.floor(minZ * 2); z <= Math.ceil(maxZ * 2); z++) {
          // Include only points that are not already integers (Z1)
          if (x % 2 !== 0 || y % 2 !== 0 || z % 2 !== 0) {
            const p = new THREE.Vector3(x / 2, y / 2, z / 2);
            const location = checkPointLocation(p, v[0], v[1], v[2], v[3]);
            points.push({ position: p, type: 'Z2', location });
          }
        }
      }
    }

    // Count points *inside or on boundary* for the formula
    const cnts = {
      I1: points.filter(p => p.type === 'Z1' && p.location === 'Interior').length,
      B1: points.filter(p => p.type === 'Z1' && p.location === 'Boundary').length,
      // For Z2 counts, include Z1 points that are inside/on boundary
      I2_total: points.filter(p => p.location === 'Interior' && (p.type === 'Z1' || p.type === 'Z2')).length,
      B2_total: points.filter(p => p.location === 'Boundary' && (p.type === 'Z1' || p.type === 'Z2')).length,
    };

    return { vertices: v, edges: edgs, geometry: geom, latticePoints: points, counts: cnts };
  }, [r]);

  const calculatedVolume = useMemo(() => {
    const { I1, B1, I2_total, B2_total } = counts;
    // Simplified formula: 12V = 2*I2_total + B2_total - 2 * (2*I1 + B1)
    return (2 * I2_total + B2_total - 2 * (2 * I1 + B1)) / 12;
  }, [counts]);

  const actualVolume = r / 6;

  return (
    <div className="h-[500px] w-full relative">
        <Canvas camera={{ position: [2, 2, Math.max(3, r * 1.5)], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} intensity={1} />

            {/* Tetrahedron */}
            <mesh geometry={geometry}>
                <meshStandardMaterial color="skyblue" side={THREE.DoubleSide} transparent opacity={0.3} wireframe={false} />
            </mesh>
            {edges.map((edge, i) => <Line key={`edge-${i}`} points={edge} color="black" lineWidth={1} />)}
            {/* No vertex spheres here */}

            {/* Render ALL Z1 and Z2 lattice points */}
            {latticePoints.map((p, i) => (
                <Sphere key={`point-${i}`} args={[p.type === 'Z1' ? 0.04 : 0.03, 16, 16]} position={p.position}>
                    <meshStandardMaterial
                        color={p.type === 'Z1' ? 'blue' : 'green'}
                        transparent={p.location === 'Outside'}
                        opacity={p.location === 'Outside' ? 0.2 : 0.9}
                    />
                </Sphere>
            ))}

            <axesHelper args={[Math.max(1.5, r * 0.5)]} />
            <OrbitControls />
        </Canvas>
         <div className="absolute top-2 left-2 bg-white/80 dark:bg-black/80 p-2 rounded text-xs">
            <p><strong>Z1 (Blue):</strong> Points in view shown.</p>
            <p><strong>Z2 (Green, non-Z1):</strong> Points in view shown.</p>
            <hr className="my-1 border-gray-400"/>
            <p><strong>Counts for Formula (Inside/Boundary):</strong></p>
            <p className="ml-2">I₁={counts.I1}, B₁={counts.B1}</p>
            <p className="ml-2">I₂<small>(total)</small>={counts.I2_total}, B₂<small>(total)</small>={counts.B2_total}</p>
            <hr className="my-1 border-gray-400"/>
            <p><strong>Reeve Calc:</strong> 12V = 2*I₂ + B₂ - 2*(2*I₁ + B₁)</p>
            <p className="ml-2">= 2*{counts.I2_total} + {counts.B2_total} - 2*(2*{counts.I1} + {counts.B1}) = {12 * calculatedVolume}</p>
            <p><strong>Actual Volume:</strong> V = r/6 = {actualVolume.toFixed(4)}</p>
            <p><strong>Calculated Volume:</strong> V = {calculatedVolume.toFixed(4)}</p>
        </div>
    </div>
  );
};

export default ReeveFormulaViz; 