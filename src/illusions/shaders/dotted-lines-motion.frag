uniform float uTime;
uniform float uSpeed;
uniform float uLineCount;
uniform float uDotSpacing;
uniform float uDotSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  vec3 bg = vec3(0.95);
  vec3 col = bg;
  
  float lines = uLineCount;
  float lineH = 1.0 / lines;
  
  float rowIdx = floor(uv.y / lineH);
  float localY = fract(uv.y / lineH);
  
  // Alternating rows have offset dots
  float offset = mod(rowIdx, 2.0) * 0.5 * uDotSpacing / lines;
  float phase = uTime * uSpeed * 0.5;
  
  // Different speeds per row group create motion illusion
  float rowPhase = mod(rowIdx, 3.0) * 0.33;
  float animOffset = sin(phase + rowPhase * 6.28318) * 0.02;
  
  float dotSpacing = uDotSpacing / lines;
  float x = uv.x + offset + animOffset;
  
  float dotX = fract(x / dotSpacing);
  float dotY = localY;
  
  vec2 dotUV = vec2(dotX - 0.5, dotY - 0.5);
  float d = length(dotUV);
  
  float dotR = uDotSize * 0.006;
  float dot = smoothstep(dotR + 0.002, dotR - 0.002, d);
  
  // Color based on row
  float rowColor = mod(rowIdx, 2.0);
  vec3 dotCol = mix(uColor1, uColor2, rowColor);
  
  // Also draw the connecting line (thin)
  float lineY = abs(localY - 0.5);
  float line = smoothstep(0.015, 0.005, lineY);
  
  col = mix(col, dotCol * 0.3 + bg * 0.7, line * 0.3);
  col = mix(col, dotCol, dot);
  
  gl_FragColor = vec4(col, 1.0);
}
