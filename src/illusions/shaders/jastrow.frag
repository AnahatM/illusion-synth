uniform float uOffset;
uniform float uShowProof;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 col = vec3(0.15);

  // Jastrow illusion: two identical flat arc segments
  float innerR = 0.25;
  float outerR = 0.32;
  float halfArc = 1.1; // half angular span (~63° each side)

  float sep = uOffset * 0.04;

  // Arcs open downward (centred on -PI/2).
  // At the midpoint of the arc, points lie at y = centre.y - r.
  // Inner edge (top of shape): centre.y - innerR
  // Outer edge (bottom of shape): centre.y - outerR

  // Shape A (upper arc)
  vec2 centreA = vec2(0.0, 0.22);
  vec2 pA = uv - centreA;
  float rA = length(pA);
  float aA = atan(pA.y, pA.x);
  float inA = step(innerR, rA) * step(rA, outerR)
            * step(-PI * 0.5 - halfArc, aA) * step(aA, -PI * 0.5 + halfArc);

  // Shape B (lower arc): inner edge aligns with A's outer edge, plus separation.
  // B's inner edge at midpoint: centreB.y - innerR = centreA.y - outerR - sep
  // => centreB.y = centreA.y - (outerR - innerR) - sep
  vec2 centreB = vec2(0.0, centreA.y - (outerR - innerR) - sep);
  vec2 pB = uv - centreB;
  float rB = length(pB);
  float aB = atan(pB.y, pB.x);
  float inB = step(innerR, rB) * step(rB, outerR)
            * step(-PI * 0.5 - halfArc, aB) * step(aB, -PI * 0.5 + halfArc);

  // Colours
  vec3 colA = vec3(0.3, 0.6, 0.85);
  vec3 colB = vec3(0.85, 0.45, 0.3);

  // Soft borders
  float bw = 0.004;
  float ba = 0.025;
  float borderA = step(innerR - bw, rA) * step(rA, outerR + bw)
                * step(-PI * 0.5 - halfArc - ba, aA) * step(aA, -PI * 0.5 + halfArc + ba);
  float edgeA = borderA * (1.0 - inA);

  float borderB = step(innerR - bw, rB) * step(rB, outerR + bw)
                * step(-PI * 0.5 - halfArc - ba, aB) * step(aB, -PI * 0.5 + halfArc + ba);
  float edgeB = borderB * (1.0 - inB);

  col = mix(col, colA, inA);
  col = mix(col, colB, inB);
  col = mix(col, colA * 0.6, edgeA * 0.5);
  col = mix(col, colB * 0.6, edgeB * 0.5);

  // Show proof: overlay B outline at A position
  if (uShowProof > 0.5) {
    vec2 pProof = uv - centreA;
    float rP = length(pProof);
    float aP = atan(pProof.y, pProof.x);
    float proofOuter = step(innerR - 0.002, rP) * step(rP, outerR + 0.002)
                     * step(-PI * 0.5 - halfArc - 0.01, aP) * step(aP, -PI * 0.5 + halfArc + 0.01);
    float proofInner = step(innerR + 0.002, rP) * step(rP, outerR - 0.002)
                     * step(-PI * 0.5 - halfArc + 0.01, aP) * step(aP, -PI * 0.5 + halfArc - 0.01);
    float proofEdge = proofOuter * (1.0 - proofInner);
    col = mix(col, vec3(1.0, 1.0, 0.0), proofEdge * 0.9);
  }

  gl_FragColor = vec4(col, 1.0);
}
