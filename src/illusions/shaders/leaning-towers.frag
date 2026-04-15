uniform float uSeparation;
uniform float uTowerWidth;
uniform float uTowerHeight;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  
  vec3 bg = vec3(0.92);
  vec3 col = bg;
  
  float sep = uSeparation * 0.5;
  float tw = uTowerWidth;
  float th = uTowerHeight;
  
  // Two identical tall rectangles side by side
  // When placed next to each other, they appear to lean outward
  
  // Left tower
  float leftX = uv.x + sep;
  float leftInside = step(-tw, leftX) * step(leftX, tw) * step(-th, uv.y) * step(uv.y, th);
  
  // Right tower
  float rightX = uv.x - sep;
  float rightInside = step(-tw, rightX) * step(rightX, tw) * step(-th, uv.y) * step(uv.y, th);
  
  // Add perspective lines to towers (converging at top - like buildings)
  float floors = 12.0;
  float floorH = th * 2.0 / floors;
  
  // Left tower body with floor lines
  if (leftInside > 0.5) {
    float localY = (uv.y + th) / (th * 2.0);
    float floorLine = abs(fract(localY * floors) - 0.5);
    float fLine = smoothstep(0.02, 0.04, floorLine);
    
    // Side shading for 3D look
    float localX = (leftX + tw) / (tw * 2.0);
    float shade = 0.8 + 0.2 * localX;
    
    col = uColor1 * shade;
    col *= 0.7 + 0.3 * fLine;
    
    // Window pattern
    float wx = fract(localX * 4.0);
    float wy = fract(localY * floors);
    float window = step(0.2, wx) * step(wx, 0.8) * step(0.25, wy) * step(wy, 0.75);
    col = mix(col, col * 0.6, window * 0.5);
  }
  
  // Right tower body with floor lines
  if (rightInside > 0.5) {
    float localY = (uv.y + th) / (th * 2.0);
    float floorLine = abs(fract(localY * floors) - 0.5);
    float fLine = smoothstep(0.02, 0.04, floorLine);
    
    float localX = (rightX + tw) / (tw * 2.0);
    float shade = 0.8 + 0.2 * localX;
    
    col = uColor2 * shade;
    col *= 0.7 + 0.3 * fLine;
    
    float wx = fract(localX * 4.0);
    float wy = fract(localY * floors);
    float window = step(0.2, wx) * step(wx, 0.8) * step(0.25, wy) * step(wy, 0.75);
    col = mix(col, col * 0.6, window * 0.5);
  }
  
  // Outline
  float leftEdge = smoothstep(0.008, 0.003, abs(leftX - tw) * leftInside)
                 + smoothstep(0.008, 0.003, abs(leftX + tw) * leftInside);
  float rightEdge = smoothstep(0.008, 0.003, abs(rightX - tw) * rightInside)
                  + smoothstep(0.008, 0.003, abs(rightX + tw) * rightInside);
  
  col = mix(col, vec3(0.1), min(1.0, (leftEdge + rightEdge) * 0.7));
  
  gl_FragColor = vec4(col, 1.0);
}
