uniform float uGridSize;
uniform float uObjPos;
uniform float uShowProof;
uniform vec3 uNearColor;
uniform vec3 uFarColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.15);

  // Perspective grid: converging lines to a vanishing point
  vec2 vp = vec2(0.5, 0.55); // vanishing point
  float gridLines = uGridSize;

  // Horizontal lines (converging toward vanishing point)
  for (float i = 0.0; i < 16.0; i++) {
    if (i >= gridLines) break;
    float y = i / gridLines;
    // Perspective-warped y
    float py = mix(y, vp.y, y * 0.6);
    float dist = abs(uv.y - py);
    float lineW = mix(0.003, 0.001, y);
    float line = smoothstep(lineW, lineW * 0.3, dist);
    col = mix(col, vec3(0.35), line);
  }

  // Vertical lines (converging to vanishing point)
  for (float i = 0.0; i < 16.0; i++) {
    if (i >= gridLines) break;
    float x = (i + 0.5) / gridLines;

    // Line from bottom to vanishing point
    vec2 bot = vec2(x, 0.0);
    vec2 dir = normalize(vp - bot);

    // Distance from uv to this line
    vec2 d = uv - bot;
    float t = dot(d, dir);
    float dist = length(d - dir * t);

    // Only draw from bottom to vanishing point
    float prog = t / length(vp - bot);
    float vis = step(0.0, prog) * step(prog, 1.0);

    float lineW = mix(0.003, 0.0005, prog);
    float line = smoothstep(lineW, lineW * 0.3, dist) * vis;
    col = mix(col, vec3(0.35), line);
  }

  // Two identical objects (circles) at different grid positions
  float objR = 0.035;

  // Near object (bottom, appears "normal")
  vec2 nearPos = vec2(0.5, 0.15);
  // Far object (top, appears "larger" due to perspective context)
  float farY = mix(0.15, vp.y, uObjPos);
  float farX = mix(0.5, vp.x, uObjPos);
  vec2 farPos = vec2(farX, farY);

  float nearDist = length(uv - nearPos);
  float farDist = length(uv - farPos);

  float near = smoothstep(objR, objR - 0.004, nearDist);
  float far = smoothstep(objR, objR - 0.004, farDist);

  col = mix(col, uNearColor, near);
  col = mix(col, uFarColor, far);

  // Show proof: draw lines showing equal size
  if (uShowProof > 0.5) {
    // Size reference lines around both objects
    float refNear = abs(length(uv - nearPos) - objR);
    float refFar = abs(length(uv - farPos) - objR);
    float ref = smoothstep(0.003, 0.001, refNear) + smoothstep(0.003, 0.001, refFar);
    col = mix(col, vec3(1.0, 1.0, 0.0), clamp(ref, 0.0, 1.0) * 0.9);
  }

  gl_FragColor = vec4(col, 1.0);
}
