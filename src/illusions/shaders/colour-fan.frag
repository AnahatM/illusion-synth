uniform float uSectors;
uniform float uRadius;
uniform float uOverlap;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  
  vec3 bg = vec3(0.95);
  vec3 col = bg;
  
  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  
  float circMask = smoothstep(uRadius + 0.01, uRadius - 0.01, r);
  
  // Create colored sectors/fans
  float numSectors = uSectors;
  float sectorAngle = 6.28318530 / numSectors;
  float overlap = uOverlap * sectorAngle;
  
  // Background white circle 
  vec3 diskCol = vec3(1.0);
  
  // Overlay colored sectors with overlap
  // Sector 1 (primary)
  for (int i = 0; i < 20; i++) {
    if (float(i) >= numSectors) break;
    float fi = float(i);
    float startAngle = fi * sectorAngle;
    float endAngle = startAngle + sectorAngle * (0.5 + uOverlap);
    
    // Normalize angle to [0, 2π]
    float a = mod(angle + 3.14159265, 6.28318530);
    float sa = mod(startAngle, 6.28318530);
    float ea = mod(endAngle, 6.28318530);
    
    float inSector;
    if (sa < ea) {
      inSector = step(sa, a) * step(a, ea);
    } else {
      inSector = step(sa, a) + step(a, ea);
    }
    inSector = min(inSector, 1.0);
    
    // Cycle through 3 colors
    vec3 sCol;
    float ci = mod(fi, 3.0);
    if (ci < 0.5) sCol = uColor1;
    else if (ci < 1.5) sCol = uColor2;
    else sCol = uColor3;
    
    // Additive-ish blending in overlap regions
    diskCol = mix(diskCol, sCol, inSector * 0.5);
  }
  
  col = mix(bg, diskCol, circMask);
  
  // Thin black sector lines
  float sectorLine = abs(sin(angle * numSectors * 0.5));
  float sLine = smoothstep(0.02, 0.04, sectorLine) * circMask;
  col = mix(col * 0.4, col, sLine);
  
  gl_FragColor = vec4(col, 1.0);
}
