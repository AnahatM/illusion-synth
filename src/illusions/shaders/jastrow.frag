uniform float uOffset;
uniform float uShowProof;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 col = vec3(0.0);

  // Jastrow illusion: two IDENTICAL arc segments (same radii, same angular span)
  // stacked vertically. The bottom one appears larger because the brain compares
  // the long outer arc of B with the short inner arc of A.
  float innerR = 0.22;
  float outerR = 0.30;
  float halfArc = 1.2;               // half angular span (~69 deg each side)

  float sep = uOffset * 0.015;       // vertical gap between arcs

  // Both arcs centred on +PI/2 (bowing upward).
  // A is the upper arc, B is the lower arc.
  // Place A so its inner edge sits at y ~ 0.02 (at the midpoint).
  // At the midpoint (directly above centre), distance = centreA.y + innerR for the inner edge.
  // We want A's inner edge midpoint at y=sep/2, B's outer edge midpoint at y=-sep/2.
  // centreA.y + innerR = sep/2  =>  centreA.y = sep/2 - innerR
  // centreB.y + outerR = -sep/2  =>  centreB.y = -sep/2 - outerR
  vec2 centreA = vec2(0.0, sep * 0.5 - innerR);
  vec2 centreB = vec2(0.0, -sep * 0.5 - outerR);

  // Shape A (upper arc)
  vec2 pA = uv - centreA;
  float rA = length(pA);
  float aA = atan(pA.y, pA.x);
  float inA = step(innerR, rA) * step(rA, outerR)
            * step(PI * 0.5 - halfArc, aA) * step(aA, PI * 0.5 + halfArc);

  // Shape B (lower arc) — identical radii, different centre
  vec2 pB = uv - centreB;
  float rB = length(pB);
  float aB = atan(pB.y, pB.x);
  float inB = step(innerR, rB) * step(rB, outerR)
            * step(PI * 0.5 - halfArc, aB) * step(aB, PI * 0.5 + halfArc);

  // Colours
  vec3 colA = uColor1;
  vec3 colB = uColor2;

  // Soft borders
  float bw = 0.004;
  float ba = 0.025;
  float borderA = step(innerR - bw, rA) * step(rA, outerR + bw)
                * step(PI * 0.5 - halfArc - ba, aA) * step(aA, PI * 0.5 + halfArc + ba);
  float edgeA = borderA * (1.0 - inA);

  float borderB = step(innerR - bw, rB) * step(rB, outerR + bw)
                * step(PI * 0.5 - halfArc - ba, aB) * step(aB, PI * 0.5 + halfArc + ba);
  float edgeB = borderB * (1.0 - inB);

  col = mix(col, colA, inA);
  col = mix(col, colB, inB);
  col = mix(col, colA * 0.6, edgeA * 0.5);
  col = mix(col, colB * 0.6, edgeB * 0.5);

  // Show proof: draw B's outline at A's position to show they're identical
  if (uShowProof > 0.5) {
    // Draw outline of an arc at centreA's position with same radii
    float proofOuter = step(innerR - 0.002, rA) * step(rA, outerR + 0.002)
                     * step(PI * 0.5 - halfArc - 0.01, aA) * step(aA, PI * 0.5 + halfArc + 0.01);
    float proofInner = step(innerR + 0.002, rA) * step(rA, outerR - 0.002)
                     * step(PI * 0.5 - halfArc + 0.01, aA) * step(aA, PI * 0.5 + halfArc - 0.01);
    float proofEdge = proofOuter * (1.0 - proofInner);
    col = mix(col, vec3(1.0, 1.0, 0.0), proofEdge * 0.9);
  }

  gl_FragColor = vec4(col, 1.0);
}
