uniform float uTime;
uniform float uSpeed;
uniform float uDepth;
uniform float uShowFeatures;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(0.3);

  // Simple face using SDF-like shapes
  float faceR = 0.3;

  // Face outline / sphere
  float faceDist = length(uv);
  float faceMask = smoothstep(faceR + 0.01, faceR - 0.01, faceDist);

  // Skin color
  vec3 skin = vec3(0.85, 0.72, 0.58);

  // Lighting that creates convex appearance even for concave surface
  float depth = uDepth;
  float lightAngle = uTime * uSpeed * 0.5;
  vec2 lightDir = vec2(cos(lightAngle), sin(lightAngle));
  float lighting = dot(normalize(uv), lightDir) * 0.3 + 0.7;

  vec3 faceCol = skin * lighting;

  // Eyes
  vec2 leftEye = vec2(-0.08, 0.05);
  vec2 rightEye = vec2(0.08, 0.05);
  float eyeR = 0.035;
  float pupilR = 0.015;

  float leftEyeDist = length(uv - leftEye);
  float rightEyeDist = length(uv - rightEye);

  float inLeftEye = smoothstep(eyeR, eyeR - 0.005, leftEyeDist);
  float inRightEye = smoothstep(eyeR, eyeR - 0.005, rightEyeDist);

  float inLeftPupil = smoothstep(pupilR, pupilR - 0.005, leftEyeDist);
  float inRightPupil = smoothstep(pupilR, pupilR - 0.005, rightEyeDist);

  // Nose
  vec2 nosePos = vec2(0.0, -0.02);
  float noseShadow = smoothstep(0.05, 0.02, length(uv - nosePos)) * 0.2;

  // Mouth
  vec2 mouthPos = vec2(0.0, -0.1);
  float mouthDist = length((uv - mouthPos) * vec2(1.0, 2.0));
  float mouth = smoothstep(0.06, 0.055, mouthDist) * step(uv.y, mouthPos.y + 0.02);

  // Compose face
  col = mix(col, faceCol, faceMask);

  if (uShowFeatures > 0.5) {
    col = mix(col, vec3(1.0), (inLeftEye + inRightEye) * faceMask);
    col = mix(col, vec3(0.15), (inLeftPupil + inRightPupil) * faceMask);
    col -= noseShadow * faceMask;
    col = mix(col, vec3(0.6, 0.2, 0.2), mouth * faceMask * 0.8);
  }

  gl_FragColor = vec4(col, 1.0);
}
