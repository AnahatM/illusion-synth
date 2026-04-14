uniform float uOffset;
uniform float uShowProof;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 col = vec3(0.15);

  // Jastrow illusion: two identical arc segments in rainbow orientation
  // Both share the SAME centre of curvature so their edges align perfectly.
  float thickness = 0.08;            // radial thickness of each arc
  float innerR_A = 0.18;             // inner radius of shape A
  float outerR_A = innerR_A + thickness;
  float halfArc = 1.2;               // half angular span (~69 deg each side)

  float sep = uOffset * 0.02;        // small radial gap between arcs

  // Shape B sits directly inside A (smaller radius)
  float outerR_B = innerR_A - sep;
  float innerR_B = outerR_B - thickness;

  // Shared centre of curvature — arcs bow upward (centred on +PI/2)
  vec2 centre = vec2(0.0, -0.12);

  // Shape A (outer arc)
  vec2 pA = uv - centre;
  float rA = length(pA);
  float aA = atan(pA.y, pA.x);
  float inA = step(innerR_A, rA) * step(rA, outerR_A)
            * step(PI * 0.5 - halfArc, aA) * step(aA, PI * 0.5 + halfArc);

  // Shape B (inner arc)
  vec2 pB = uv - centre;
  float rB = length(pB);
  float aB = atan(pB.y, pB.x);
  float inB = step(innerR_B, rB) * step(rB, outerR_B)
            * step(PI * 0.5 - halfArc, aB) * step(aB, PI * 0.5 + halfArc);

  // Colours
  vec3 colA = uColor1;
  vec3 colB = uColor2;

  // Soft borders
  float bw = 0.004;
  float ba = 0.025;
  float borderA = step(innerR_A - bw, rA) * step(rA, outerR_A + bw)
                * step(PI * 0.5 - halfArc - ba, aA) * step(aA, PI * 0.5 + halfArc + ba);
  float edgeA = borderA * (1.0 - inA);

  float borderB = step(innerR_B - bw, rB) * step(rB, outerR_B + bw)
                * step(PI * 0.5 - halfArc - ba, aB) * step(aB, PI * 0.5 + halfArc + ba);
  float edgeB = borderB * (1.0 - inB);

  col = mix(col, colA, inA);
  col = mix(col, colB, inB);
  col = mix(col, colA * 0.6, edgeA * 0.5);
  col = mix(col, colB * 0.6, edgeB * 0.5);

  // Show proof: overlay B outline at A position (same centre, A radii)
  if (uShowProof > 0.5) {
    float proofOuter = step(innerR_A - 0.002, rA) * step(rA, outerR_A + 0.002)
                     * step(PI * 0.5 - halfArc - 0.01, aA) * step(aA, PI * 0.5 + halfArc + 0.01);
    float proofInner = step(innerR_A + 0.002, rA) * step(rA, outerR_A - 0.002)
                     * step(PI * 0.5 - halfArc + 0.01, aA) * step(aA, PI * 0.5 + halfArc - 0.01);
    float proofEdge = proofOuter * (1.0 - proofInner);
    col = mix(col, vec3(1.0, 1.0, 0.0), proofEdge * 0.9);
  }

  gl_FragColor = vec4(col, 1.0);
}
