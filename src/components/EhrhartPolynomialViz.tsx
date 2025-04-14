'use client';

import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import TeX from '@matejmazur/react-katex';
import { checkPointLocation } from '@/lib/geometryUtils'; // Use shared helper
interface EhrhartPolynomialVizProps {
  r: number;
}

const EhrhartPolynomialViz: React.FC<EhrhartPolynomialVizProps> = ({ r }) => {
  const [tValue, setTValue] = useState<number>(1);

  const { vertices, edges, geometry, latticePoints, pointCount } = useMemo(() => {
    const scale = tValue;
    const v = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(scale, 0, 0),
      new THREE.Vector3(0, scale, 0),
      new THREE.Vector3(scale, scale, scale * r),
    ];

    const geom = new THREE.BufferGeometry().setFromPoints(v);
    geom.setIndex([0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3]);
    geom.computeVertexNormals();

    const edgs = [
        [v[0], v[1]], [v[0], v[2]], [v[1], v[2]],
        [v[0], v[3]], [v[1], v[3]], [v[2], v[3]],
    ];

    // Calculate Z1 lattice points within a bounding box around the scaled tetrahedron
    const points: { position: THREE.Vector3; location: 'Interior' | 'Boundary' | 'Outside' }[] = [];
    const range = 1.5; // How far around the base (scaled) to show points
    const minX = -range;
    const maxX = scale + range;
    const minY = -range;
    const maxY = scale + range;
    const minZ = -range;
    const maxZ = Math.max(range, scale * r + range);

    let countInsideBoundary = 0;

    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
      for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
        for (let z = Math.floor(minZ); z <= Math.ceil(maxZ); z++) {
          const p = new THREE.Vector3(x, y, z);
          // Check location relative to the *scaled* tetrahedron
          const location = checkPointLocation(p, v[0], v[1], v[2], v[3]);
          points.push({ position: p, location });
          if (location !== 'Outside') {
            countInsideBoundary++;
          }
        }
      }
    }

    return { vertices: v, edges: edgs, geometry: geom, latticePoints: points, pointCount: countInsideBoundary };
  }, [r, tValue]);

  // Calculate a suitable center point for the annotation
  const centerPoint = useMemo(() => {
      const scale = tValue;
      const avgX = (0 + scale + 0 + scale) / 4;
      const avgY = (0 + 0 + scale + scale) / 4;
      const avgZ = (0 + 0 + 0 + scale * r) / 4;
      // Position slightly above and behind the center of the scaled tetrahedron
      return new THREE.Vector3(avgX - scale * 0.2, avgY - scale * 0.2, avgZ + Math.max(scale * 0.5, scale * r * 0.3));
  }, [r, tValue]);

  const ehrhartValue = useMemo(() => {
    const t = tValue;
    const term3 = (r / 6) * (t ** 3);
    const term2 = t ** 2;
    const term1 = (2 - r / 6) * t;
    const term0 = 1;
    // Ehrhart polynomial must result in an integer count
    return Math.round(term3 + term2 + term1 + term0);
  }, [r, tValue]);

  return (
    <div className="h-[500px] w-full relative">
        <Canvas camera={{ position: [tValue*2, tValue*2, Math.max(tValue*3, tValue * r * 2)], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[tValue*5, tValue*5, tValue*5]} intensity={1.2} />

            {/* Scaled Tetrahedron */}
            <mesh geometry={geometry}>
                <meshStandardMaterial color="#ffcc80" side={THREE.DoubleSide} transparent opacity={0.5} wireframe={false} />
            </mesh>
            {edges.map((edge, i) => <Line key={`edge-${i}`} points={edge} color="#555555" lineWidth={2} />)}
            {vertices.map((vertex, i) => (
                <Sphere key={`vertex-${i}`} args={[0.06, 16, 16]} position={vertex}>
                    <meshStandardMaterial color="#ff8c00" />
                </Sphere>
            ))}

            {/* Render ALL Z1 lattice points */}
            {latticePoints.map((p, i) => (
                <Sphere key={`point-${i}`} args={[0.06, 16, 16]} position={p.position}>
                    <meshStandardMaterial
                        color={p.location !== 'Outside' ? '#1e90ff' : 'lightgray'}
                        transparent={p.location === 'Outside'}
                        opacity={p.location === 'Outside' ? 0.15 : 1.0}
                    />
                </Sphere>
            ))}

            <axesHelper args={[Math.max(tValue * 1.5, tValue * r * 0.6)]} />
            <OrbitControls target={[tValue/2, tValue/2, tValue*r/4]}/>
        </Canvas>
         <div className="absolute top-2 left-2 bg-white/80 dark:bg-black/80 p-2 rounded text-xs">
            <div className="flex items-center mb-2">
                 <label htmlFor="tSlider" className="mr-2">Scale factor <TeX math="t" />:</label>
                 <input
                    id="tSlider"
                    type="number"
                    min="1"
                    max="10" // Limit for performance
                    step="1"
                    value={tValue}
                    onChange={(e) => setTValue(parseInt(e.target.value, 10) || 1)}
                    className="w-16 border rounded p-1 bg-white dark:bg-gray-700 text-black dark:text-white"
                 />
            </div>
            <p><strong>Lattice Points Count (Inside/Boundary):</strong> {pointCount}</p>
            <p><strong>Ehrhart Polynomial <TeX math={`L(T_{${r}}, ${tValue})`} />:</strong></p>
            <p className="ml-2"><TeX math={`= \\frac{${r}}{6}(${tValue}^3) + (${tValue}^2) + (2 - \\frac{${r}}{6})(${tValue}) + 1`} /></p>
            <p className="ml-2"><TeX math={`\\approx ${ehrhartValue}`} /> (rounded)</p>
            <p className={`font-semibold ${pointCount === ehrhartValue ? 'text-green-600' : 'text-red-600'}`}>Match: {pointCount === ehrhartValue ? 'Yes' : 'No'}</p>
            <p className="mt-1 text-gray-500">(Points shown are Z₁ in the vicinity)</p>
         </div>
    </div>
  );
};

export default EhrhartPolynomialViz; 