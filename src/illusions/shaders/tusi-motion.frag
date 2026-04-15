uniform float uTime;
uniform float uDotCount;
uniform float uDotSize;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float aspect = 1.0;
  
  float radius = 0.6;
  int N = int(uDotCount);
  float dotR = uDotSize * 0.03;
  
  vec3 col = vec3(0.95);
  
  // Draw the guide circle (faint)
  float d = abs(length(uv) - radius);
  col = mix(col, vec3(0.85), smoothstep(0.003, 0.001, d));
  
  // Each dot moves along a diameter at angle (i * PI / N)
  // but offset in phase by (i * 2*PI / N), creating a rolling circle effect
  float t = uTime * uSpeed;
  
  for (int i = 0; i < 40; i++) {
    if (i >= N) break;
    float fi = float(i);
    float angle = fi * 3.14159265 / float(N);
    float phase = fi * 6.28318530 / float(N);
    
    // Position along diameter
    float pos = radius * sin(t + phase);
    
    // Direction of this diameter
    vec2 dir = vec2(cos(angle), sin(angle));
    vec2 dotPos = dir * pos;
    
    float dd = length(uv - dotPos);
    
    // Color interpolation based on index
    float blend = fi / max(float(N) - 1.0, 1.0);
    vec3 dotCol = mix(uColor1, uColor2, blend);
    
    col = mix(col, dotCol, smoothstep(dotR + 0.003, dotR - 0.003, dd));
  }
  
  gl_FragColor = vec4(col, 1.0);
}
