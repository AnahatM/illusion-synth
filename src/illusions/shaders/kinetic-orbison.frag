uniform float uTime;
uniform float uSpeed;
uniform float uGridLines;
uniform float uCircleSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  
  vec3 col = vec3(0.95);
  float lineW = 0.008;
  
  // Draw grid
  
  // Horizontal grid lines
  float gy = abs(fract(uv.y * uGridLines * 0.5) - 0.5) * 2.0;
  float hLine = smoothstep(lineW * uGridLines, 0.0, gy / uGridLines);
  
  // Vertical grid lines
  float gx = abs(fract(uv.x * uGridLines * 0.5) - 0.5) * 2.0;
  float vLine = smoothstep(lineW * uGridLines, 0.0, gx / uGridLines);
  
  float grid = max(hLine, vLine);
  col = mix(col, uColor1, grid * 0.7);
  
  // Rotating circle
  float t = uTime * uSpeed;
  vec2 circleCenter = vec2(cos(t), sin(t)) * 0.0; // circle stays at center
  float r = length(uv - circleCenter);
  float circle = smoothstep(uCircleSize + 0.005, uCircleSize - 0.005, r) 
               - smoothstep(uCircleSize - 0.015, uCircleSize - 0.02, r);
  
  // Rotating circle outline that sweeps over the grid
  float angle = atan(uv.y, uv.x) - t;
  float circR = length(uv);
  
  // Draw a solid rotating circle outline
  float ringDist = abs(circR - uCircleSize);
  float ring = smoothstep(0.015, 0.005, ringDist);
  
  // Also draw rotating diameter line
  vec2 dir = vec2(cos(t), sin(t));
  float lineDist = abs(dot(uv, vec2(-dir.y, dir.x)));
  float dLine = smoothstep(0.012, 0.004, lineDist) * step(circR, uCircleSize);
  
  col = mix(col, uColor2, max(ring, dLine));
  
  gl_FragColor = vec4(col, 1.0);
}
