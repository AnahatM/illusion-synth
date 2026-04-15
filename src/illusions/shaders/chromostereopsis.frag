uniform vec3 uFrontColor;
uniform vec3 uBackColor;
uniform vec3 uBgColor;
uniform float uBarCount;
uniform float uBarWidth;
uniform float uPattern;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  vec3 col = uBgColor;
  
  if (uPattern < 0.5) {
    // Vertical bars
    float x = fract(uv.x * uBarCount);
    float bar = step(0.5 - uBarWidth * 0.5, x) * (1.0 - step(0.5 + uBarWidth * 0.5, x));
    float y = fract(uv.y * uBarCount);
    float barV = step(0.5 - uBarWidth * 0.5, y) * (1.0 - step(0.5 + uBarWidth * 0.5, y));
    col = mix(uBackColor, uFrontColor, bar);
    col = mix(col, uBgColor * 0.8, barV * 0.1);
  } else if (uPattern < 1.5) {
    // Text-like blocks on background
    vec2 cell = floor(uv * vec2(12.0, 8.0));
    float hash = fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
    if (hash > 0.3) {
      // Alternating front/back colored blocks
      float checker = mod(cell.x + cell.y, 2.0);
      col = mix(uFrontColor, uBackColor, checker);
    }
  } else {
    // Concentric rings
    vec2 center = uv - 0.5;
    float r = length(center) * uBarCount * 2.0;
    float ring = sin(r * 6.28318);
    col = mix(uFrontColor, uBackColor, step(0.0, ring));
  }
  
  gl_FragColor = vec4(col, 1.0);
}
