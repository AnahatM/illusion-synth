uniform float uTime;
uniform float uSpeed;
uniform float uDetail;
varying vec2 vUv;

#define PI 3.14159265359

// Rotate point around Y axis
vec2 rotY(vec3 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  // Orthographic projection: discard Z (the ambiguity source)
  return vec2(p.x * c - p.z * s, p.y);
}

// SDF for a line segment in 2D
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 uv = vUv - 0.5;
  vec3 col = vec3(0.12);

  float t = uTime * uSpeed;

  // Define a human figure as 3D joints
  // Standing with one leg raised, arms out (ballet pose)
  float legSwing = sin(t * 0.5) * 0.3;

  // Body joints in 3D (x, y, z)
  vec3 head     = vec3(0.0, 0.22, 0.0);
  vec3 neck     = vec3(0.0, 0.18, 0.0);
  vec3 shoulder = vec3(0.0, 0.15, 0.0);
  vec3 hip      = vec3(0.0, 0.02, 0.0);

  // Arms extended
  vec3 lHand = vec3(-0.14, 0.18, 0.06);
  vec3 rHand = vec3(0.14, 0.18, -0.06);
  vec3 lElbow = vec3(-0.08, 0.17, 0.03);
  vec3 rElbow = vec3(0.08, 0.17, -0.03);

  // Standing leg straight down
  vec3 lFoot = vec3(-0.02, -0.16, 0.0);
  vec3 lKnee = vec3(-0.01, -0.07, 0.0);

  // Raised leg (to the side/back for ballet pose)
  vec3 rKnee = vec3(0.06, 0.0, -0.08);
  vec3 rFoot = vec3(0.12, 0.04, -0.14);

  // Project all joints with rotation
  vec2 pHead = rotY(head, t);
  vec2 pNeck = rotY(neck, t);
  vec2 pShoulder = rotY(shoulder, t);
  vec2 pHip = rotY(hip, t);
  vec2 pLHand = rotY(lHand, t);
  vec2 pRHand = rotY(rHand, t);
  vec2 pLElbow = rotY(lElbow, t);
  vec2 pRElbow = rotY(rElbow, t);
  vec2 pLFoot = rotY(lFoot, t);
  vec2 pLKnee = rotY(lKnee, t);
  vec2 pRKnee = rotY(rKnee, t);
  vec2 pRFoot = rotY(rFoot, t);

  // Draw segments
  float d = 1.0;
  float w = 0.005 * uDetail;

  // Spine
  d = min(d, sdSegment(uv, pHead, pNeck));
  d = min(d, sdSegment(uv, pNeck, pShoulder));
  d = min(d, sdSegment(uv, pShoulder, pHip));

  // Arms
  d = min(d, sdSegment(uv, pShoulder, pLElbow));
  d = min(d, sdSegment(uv, pLElbow, pLHand));
  d = min(d, sdSegment(uv, pShoulder, pRElbow));
  d = min(d, sdSegment(uv, pRElbow, pRHand));

  // Legs
  d = min(d, sdSegment(uv, pHip, pLKnee));
  d = min(d, sdSegment(uv, pLKnee, pLFoot));
  d = min(d, sdSegment(uv, pHip, pRKnee));
  d = min(d, sdSegment(uv, pRKnee, pRFoot));

  // Head circle
  float headR = 0.025;
  d = min(d, length(uv - pHead) - headR);

  // Render as silhouette
  float silhouette = smoothstep(w, w * 0.3, d);
  col = mix(col, vec3(0.85), silhouette);

  // Joint dots
  float jointR = 0.008;
  float joints = 0.0;
  joints = max(joints, smoothstep(jointR, jointR * 0.3, length(uv - pShoulder)));
  joints = max(joints, smoothstep(jointR, jointR * 0.3, length(uv - pHip)));
  joints = max(joints, smoothstep(jointR, jointR * 0.3, length(uv - pLElbow)));
  joints = max(joints, smoothstep(jointR, jointR * 0.3, length(uv - pRElbow)));
  joints = max(joints, smoothstep(jointR, jointR * 0.3, length(uv - pLKnee)));
  joints = max(joints, smoothstep(jointR, jointR * 0.3, length(uv - pRKnee)));
  col = mix(col, vec3(0.85), joints);

  gl_FragColor = vec4(col, 1.0);
}
