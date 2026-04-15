uniform float uRows;
uniform float uColumns;
uniform float uShift;
uniform float uDotSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  vec3 bg = vec3(0.5);
  vec3 col = bg;
  
  float rows = uRows;
  float cols = uColumns;
  
  float cellH = 1.0 / rows;
  float cellW = 1.0 / cols;
  
  float rowIdx = floor(uv.y / cellH);
  float colIdx = floor(uv.x / cellW);
  
  // Alternating row shift creates the spine drift effect
  float shift = mod(rowIdx, 2.0) * uShift * cellW;
  float shiftedX = uv.x - shift;
  
  float localX = fract(shiftedX / cellW);
  float localY = fract(uv.y / cellH);
  
  // Zigzag spine pattern
  vec2 localUV = vec2(localX, localY);
  vec2 center = vec2(0.5, 0.5);
  float d = length(localUV - center);
  
  float dotR = uDotSize * 0.015;
  
  // Each cell has a tilted dash/line segment
  float angle = mod(rowIdx, 2.0) * 0.5 - 0.25;
  vec2 dir = vec2(cos(angle * 3.14159), sin(angle * 3.14159));
  vec2 perp = vec2(-dir.y, dir.x);
  
  vec2 p = localUV - center;
  float along = abs(dot(p, dir));
  float across = abs(dot(p, perp));
  
  float lineLen = 0.35;
  float lineW = dotR;
  
  float dash = step(across, lineW) * step(along, lineLen);
  
  // Alternate colors per row
  float rowColor = mod(rowIdx + colIdx, 2.0);
  vec3 elemColor = mix(uColor1, uColor2, rowColor);
  
  col = mix(bg, elemColor, dash);
  
  // Add small dots at intersections
  float dotD = length(localUV - center);
  float dot2 = smoothstep(dotR * 0.6, dotR * 0.3, dotD);
  col = mix(col, elemColor * 1.2, dot2);
  
  gl_FragColor = vec4(col, 1.0);
}
