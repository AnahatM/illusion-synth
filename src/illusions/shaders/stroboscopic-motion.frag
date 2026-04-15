uniform float uTime;
uniform float uSpeed;
uniform float uDotSize;
uniform float uSpacing;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  
  vec3 bg = vec3(0.12);
  vec3 col = bg;
  
  float t = uTime * uSpeed;
  
  // Three frames alternating to create ambiguous apparent motion
  // Frame pattern cycles: AB -> BC -> CA (element motion) or AB -> BA (group motion)
  
  float cycle = mod(t, 3.0);
  float frame = floor(cycle);
  float blend = fract(cycle);
  
  // Smooth transition factor
  float show = smoothstep(0.0, 0.15, blend) * smoothstep(1.0, 0.85, blend);
  
  float spacing = uSpacing * 0.3;
  float dotR = uDotSize * 0.04;
  
  // Row of 3 elements with shifting positions
  for (int row = -2; row <= 2; row++) {
    float ry = float(row) * spacing * 2.0;
    
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float baseX = (fi - 1.0) * spacing;
      
      vec2 pos;
      if (frame < 1.0) {
        // Frame 0: dots at positions 0, 1, 2
        pos = vec2(baseX, ry);
      } else if (frame < 2.0) {
        // Frame 1: shift right by half spacing
        pos = vec2(baseX + spacing * 0.5, ry);
      } else {
        // Frame 2: shift back
        pos = vec2(baseX, ry);
      }
      
      float d = length(uv - pos);
      float dot = smoothstep(dotR + 0.005, dotR - 0.005, d);
      
      vec3 dotCol = mix(uColor1, uColor2, mod(fi + frame, 2.0));
      col = mix(col, dotCol * show + dotCol * 0.3 * (1.0 - show), dot);
    }
  }
  
  gl_FragColor = vec4(col, 1.0);
}
