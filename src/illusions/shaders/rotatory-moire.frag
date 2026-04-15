uniform float uTime;
uniform float uSpeed;
uniform float uLineCount;
uniform float uLineWidth;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  
  float angle1 = atan(uv.y, uv.x);
  float angle2 = atan(uv.y, uv.x) + uTime * uSpeed * 0.3;
  
  float lines = uLineCount;
  
  // First radial pattern (static)
  float pattern1 = sin(angle1 * lines);
  float stripe1 = smoothstep(-uLineWidth, uLineWidth, pattern1);
  
  // Second radial pattern (rotating)
  float pattern2 = sin(angle2 * lines);
  float stripe2 = smoothstep(-uLineWidth, uLineWidth, pattern2);
  
  // Combine via multiply (moiré)
  float combined = stripe1 * stripe2;
  
  // Fade at center to avoid singularity
  float r = length(uv);
  float centerFade = smoothstep(0.02, 0.1, r);
  
  vec3 col = mix(uColor1, uColor2, combined);
  col = mix(vec3(0.5), col, centerFade);
  
  // Circular mask
  float mask = smoothstep(1.0, 0.98, r);
  col = mix(vec3(0.95), col, mask);
  
  gl_FragColor = vec4(col, 1.0);
}
