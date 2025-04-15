import * as THREE from 'three';

// Epsilon for floating point comparisons
export const EPSILON = 1e-9;

// Helper function to check if a point is on a line segment
export function isPointOnSegment(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3): boolean {
  const ab = new THREE.Vector3().subVectors(b, a);
  const ap = new THREE.Vector3().subVectors(p, a);
  const cross = new THREE.Vector3().crossVectors(ab, ap);
  if (cross.lengthSq() > EPSILON) return false; // Not collinear
  const dot = ab.dot(ap);
  if (dot < -EPSILON || dot > ab.lengthSq() + EPSILON) return false; // Outside segment bounds
  return true;
}

// Helper function to check if a point is inside or on a triangle (using barycentric coordinates)
export function isPointInTriangle(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): { onEdge: boolean; inside: boolean } {
    const v0 = new THREE.Vector3().subVectors(c, a);
    const v1 = new THREE.Vector3().subVectors(b, a);
    const v2 = new THREE.Vector3().subVectors(p, a);

    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    // Handle potential division by zero if triangle is degenerate
    if (!isFinite(invDenom)) return { onEdge: false, inside: false };

    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    const isInside = u >= -EPSILON && v >= -EPSILON && (u + v <= 1 + EPSILON);
    // Check edge condition more carefully considering epsilon
    const isOnEdgeU = Math.abs(u) < EPSILON;
    const isOnEdgeV = Math.abs(v) < EPSILON;
    const isOnEdgeSum = Math.abs(u + v - 1) < EPSILON;
    const isOnEdge = isInside && (isOnEdgeU || isOnEdgeV || isOnEdgeSum);

    return { onEdge: isOnEdge, inside: isInside };
}


// Helper function to check point location relative to tetrahedron
// Returns: 'Interior', 'Boundary', 'Outside'
export function checkPointLocation(p: THREE.Vector3, vA: THREE.Vector3, vB: THREE.Vector3, vC: THREE.Vector3, vD: THREE.Vector3): 'Interior' | 'Boundary' | 'Outside' {
  const vertices = [vA, vB, vC, vD];
  const faces = [
    { vertices: [vA, vB, vC], normal: new THREE.Plane().setFromCoplanarPoints(vA, vB, vC).normal, origin: vA }, // ABC base
    { vertices: [vA, vB, vD], normal: new THREE.Plane().setFromCoplanarPoints(vA, vB, vD).normal, origin: vA }, // ABD
    { vertices: [vA, vC, vD], normal: new THREE.Plane().setFromCoplanarPoints(vA, vC, vD).normal, origin: vA }, // ACD
    { vertices: [vB, vC, vD], normal: new THREE.Plane().setFromCoplanarPoints(vB, vC, vD).normal, origin: vB }  // BCD
  ];

  // Use centroid as reference interior point to orient normals inwards
  const centroid = new THREE.Vector3().add(vA).add(vB).add(vC).add(vD).multiplyScalar(0.25);

  let onAnyFacePlane = false;

  for (const face of faces) {
    // Ensure normal points inward towards the centroid
    const vecToCentroid = new THREE.Vector3().subVectors(centroid, face.origin);
    if (face.normal.dot(vecToCentroid) < -EPSILON) {
      face.normal.negate();
    }

    // Calculate signed distance from point to face plane
    const vecToPoint = new THREE.Vector3().subVectors(p, face.origin);
    const dist = face.normal.dot(vecToPoint);

    if (dist < -EPSILON) {
      // Point is strictly outside this face plane, so it's outside the tetrahedron
      return 'Outside';
    } else if (Math.abs(dist) < EPSILON) {
      // Point lies on the plane of this face
      onAnyFacePlane = true;
    }
    // If dist > EPSILON, point is inside this half-space. Continue checking other faces.
  }

  // If the point wasn't outside any face plane, it's either Interior or Boundary
  if (!onAnyFacePlane) {
    return 'Interior';
  }

  // If it's on at least one face plane, we need to check if it's actually within the bounds of any face triangle
  for (const face of faces) {
     const dist = face.normal.dot(new THREE.Vector3().subVectors(p, face.origin));
     if (Math.abs(dist) < EPSILON) {
         // Project point onto the face plane (it should already be there)
         // Check if it's inside the triangle defined by face.vertices
         const triangleCheck = isPointInTriangle(p, face.vertices[0], face.vertices[1], face.vertices[2]);
         if (triangleCheck.inside) {
             // Point lies on a face (Boundary)
             return 'Boundary';
         }
     }
  }

  // If it's on a face plane but outside all face triangles (e.g., on the extension of a face plane)
  // Or potentially exactly on an edge/vertex shared by faces it's outside of.
  // This case should technically be 'Outside' but boundary handling near edges/vertices with floating point is tricky.
  // Treating it as boundary if it passed the half-space checks is safer for counting.
  // Re-evaluating if needed, but for visualisation/counting this is usually sufficient.
  // Let's refine: Check edges and vertices explicitly if onAnyFacePlane is true but not inside any face triangle.

    const edges = [
        [vA, vB], [vA, vC], [vB, vC], [vA, vD], [vB, vD], [vC, vD]
    ];
    for(const edge of edges) {
        if (isPointOnSegment(p, edge[0], edge[1])) return 'Boundary';
    }
    for(const vertex of vertices) {
        if (p.distanceToSquared(vertex) < EPSILON) return 'Boundary';
    }

  // If on a plane, but not within any face triangle, edge or vertex, it must be outside.
  return 'Outside';
} 