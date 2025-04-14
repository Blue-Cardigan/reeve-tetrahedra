'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import TeX from '@matejmazur/react-katex';
import { checkPointLocation } from '@/lib/geometryUtils'; // Assuming this helper exists and works

interface PointData {
  position: THREE.Vector3;
  type: 'Z1' | 'Z2'; // Z2 for non-Z1 half-integer points
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

    // Calculate Z1 and Z2 lattice points
    const points: PointData[] = [];
    const range = 1.5; // Bounding box range around the base tetrahedron (T_1)
    const minCoord = -range;
    // Adjust max bounds based on r - points near (1,1,r)
    const maxCoord = Math.max(1 + range, r + range);

    // Z1 points (Integers)
    for (let x = Math.floor(minCoord); x <= Math.ceil(maxCoord); x++) {
      for (let y = Math.floor(minCoord); y <= Math.ceil(maxCoord); y++) {
        for (let z = Math.floor(minCoord); z <= Math.ceil(maxCoord); z++) {
          const p = new THREE.Vector3(x, y, z);
          // Check relative to T_r (vertices v[0]..v[3])
          const location = checkPointLocation(p, v[0], v[1], v[2], v[3]);
           // Add only points somewhat close to the tetrahedron for visualization
           if (p.distanceTo(v[0]) < maxCoord + 1 || p.distanceTo(v[3]) < maxCoord + 1) {
               points.push({ position: p, type: 'Z1', location });
           }
        }
      }
    }

    // Z2 points (Halves, excluding Z1)
     // Iterate coordinates multiplied by 2
    for (let x2 = Math.floor(minCoord * 2); x2 <= Math.ceil(maxCoord * 2); x2++) {
      for (let y2 = Math.floor(minCoord * 2); y2 <= Math.ceil(maxCoord * 2); y2++) {
        for (let z2 = Math.floor(minCoord * 2); z2 <= Math.ceil(maxCoord * 2); z2++) {
          // Include only points that are not already integers (Z1)
          if (x2 % 2 !== 0 || y2 % 2 !== 0 || z2 % 2 !== 0) {
            const p = new THREE.Vector3(x2 / 2, y2 / 2, z2 / 2);
            const location = checkPointLocation(p, v[0], v[1], v[2], v[3]);
            // Add only points somewhat close to the tetrahedron for visualization
             if (p.distanceTo(v[0]) < maxCoord + 1 || p.distanceTo(v[3]) < maxCoord + 1) {
                points.push({ position: p, type: 'Z2', location });
             }
          }
        }
      }
    }

    // Count points *inside or on boundary* for Reeve's formula
    const I1 = points.filter(p => p.type === 'Z1' && p.location === 'Interior').length;
    const B1 = points.filter(p => p.type === 'Z1' && p.location === 'Boundary').length;
    // For Z2 counts, include Z1 points PLUS the Z2 (half-integer) points
    const I2_total = points.filter(p => p.location === 'Interior' && (p.type === 'Z1' || p.type === 'Z2')).length;
    const B2_total = points.filter(p => p.location === 'Boundary' && (p.type === 'Z1' || p.type === 'Z2')).length;

    const cnts = { I1, B1, I2_total, B2_total };

    return { vertices: v, edges: edgs, geometry: geom, latticePoints: points, counts: cnts };
  }, [r]);

  const calculatedVolume = useMemo(() => {
    const { I1, B1, I2_total, B2_total } = counts;
    // Simplified Reeve formula: 12V = 2*I2_total + B2_total - 2 * (2*I1 + B1)
    // Ensure I1=0, B1=4 for Reeve Tetrahedra validation check
     const calculated_12V = 2 * I2_total + B2_total - 2 * (2 * I1 + B1);
    return calculated_12V / 12;
  }, [counts]);

  const actualVolume = r / 6;

  return (
    <div className="h-[550px] w-full relative"> {/* Increased height */}
        {/* Use zoomed out camera */}
        <Canvas camera={{ position: [3, 3, Math.max(5, r * 2)], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 5, 5]} intensity={1.2} />

            {/* Tetrahedron faces */}
            <mesh geometry={geometry}>
                 {/* Purple color */}
                <meshStandardMaterial color="#ab87ff" side={THREE.DoubleSide} transparent opacity={0.5} wireframe={false} />
            </mesh>
            {/* Darker, thicker edges */}
            {edges.map((edge, i) => <Line key={`edge-${i}`} points={edge} color="#444444" lineWidth={2.5} />)}

            {/* Render Z1 and Z2 lattice points */}
            {latticePoints.map((p, i) => {
                 let color = 'lightgray';
                 let opacity = 0.15;
                 let size = 0.03; // Smaller base size
                 let isZ1Vertex = false;

                 if (p.type === 'Z1') {
                     isZ1Vertex = vertices.some(vtx => vtx.equals(p.position));
                     if (isZ1Vertex) {
                         color = 'gold'; // Highlight Z1 vertices
                         opacity = 1.0;
                         size = 0.08;
                     } else if (p.location === 'Boundary') {
                         color = 'blue'; // Other Z1 boundary (if any)
                         opacity = 0.9;
                         size = 0.05;
                     } else if (p.location === 'Interior') {
                         color = 'blue'; // Z1 interior (I1=0 for T_r)
                         opacity = 1.0;
                         size = 0.05;
                     } else {
                         color = '#d3d3d3'; // Z1 Outside
                     }
                 } else { // Z2 points (half-integers)
                    if (p.location === 'Boundary') {
                         color = '#20b2aa'; // Light Sea Green for Z2 Boundary
                         opacity = 0.7;
                         size = 0.04;
                    } else if (p.location === 'Interior') {
                        color = '#20b2aa'; // Light Sea Green for Z2 Interior
                        opacity = 0.9;
                        size = 0.04;
                    } else {
                         color = '#f0f0f0'; // Z2 Outside (very faint)
                         opacity = 0.1;
                    }
                 }

                 // Don't render outside points if they are too faint anyway
                 if (p.location === 'Outside' && opacity <= 0.15) return null;

                return (
                    <Sphere key={`point-${i}`} args={[size, 12, 12]} position={p.position}>
                        <meshStandardMaterial color={color} transparent={opacity < 1.0} opacity={opacity} />
                    </Sphere>
                );
            })}

            <axesHelper args={[Math.max(1.5, r * 0.6)]} />
            <OrbitControls />
        </Canvas>
        {/* Info Box */}
         <div className="absolute top-2 left-2 bg-white/80 dark:bg-black/80 p-2 rounded text-xs shadow max-w-sm">
             <p><strong>Points Legend:</strong></p>
             <ul className="list-disc list-inside ml-2 mb-1">
                <li><span style={{color: 'gold'}}>●</span> Z₁ Vertices (B₁)</li>
                <li><span style={{color: 'blue'}}>●</span> Other Z₁ Inside/Boundary</li>
                <li><span style={{color: '#20b2aa'}}>●</span> Z₂ Inside/Boundary</li>
                <li><span style={{color: '#d3d3d3'}}>●</span> Outside (Z₁/Z₂)</li>
             </ul>
            <p><strong>Counts (Inside/Boundary):</strong></p>
            <p className="ml-2">Z₁: <TeX math={`I_1=${counts.I1}, B_1=${counts.B1}`} /></p>
            <p className="ml-2">Z₂ Total: <TeX math={`I_2=${counts.I2_total}, B_2=${counts.B2_total}`} /> (includes Z₁)</p>
            <hr className="my-1 border-gray-400"/>
            <p><strong>Reeve's Formula Check:</strong></p>
            <p className="text-[11px]"><TeX math={`12V = 2 I_2 + B_2 - 2(2 I_1 + B_1)`} /></p>
            <p className="ml-2 text-[11px]"><TeX math={`= 2(${counts.I2_total}) + ${counts.B2_total} - 2(2(${counts.I1}) + ${counts.B1})`} /></p>
            <p className="ml-2 text-[11px]"><TeX math={`= ${12 * calculatedVolume}`} /></p>
            <hr className="my-1 border-gray-400"/>
            <p>Actual Volume: <TeX math={`V = r/6 = ${r}/6 = ${actualVolume.toFixed(4)}`} /></p>
            <p>Calculated Volume: <TeX math={`V = ${calculatedVolume.toFixed(4)}`} /></p>
             <p className={`font-semibold mt-1 ${Math.abs(actualVolume - calculatedVolume) < 1e-9 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                Formula Matches: {Math.abs(actualVolume - calculatedVolume) < 1e-9 ? 'Yes' : 'No'}
            </p>
        </div>
    </div>
  );
};

export default ReeveFormulaViz;