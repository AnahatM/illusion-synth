uniform float uLineCount;
uniform float uCurvature;
uniform float uLineWidth;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  
  vec3 bg = vec3(0.95);
  vec3 col = bg;
  
  float lines = uLineCount;
  float spacing = 2.0 / lines;
  
  // Draw perfectly straight horizontal lines
  // The surrounding radial context makes them look curved
  
  // Radial background pattern (creates the peripheral distortion context)
  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  
  // Radial lines from center (the inducing context)
  float radialCount = 36.0;
  float radialAngle = angle * radialCount / 6.28318;
  float radial = abs(fract(radialAngle) - 0.5) * 2.0;
  float radialLine = smoothstep(uLineWidth * 0.4, uLineWidth * 0.6, radial);
  
  // Concentric circles (additional context)
  float circleSpacing = 0.15;
  float circD = abs(fract(r / circleSpacing) - 0.5) * 2.0;
  float circleLine = smoothstep(uLineWidth * 0.3, uLineWidth * 0.5, circD);
  
  // Draw the context pattern
  float context = min(radialLine, circleLine);
  col = mix(uColor1 * 0.3, bg, context);
  
  // Circular fade for context
  float contextMask = smoothstep(1.0, 0.3, r);
  col = mix(bg, col, contextMask * uCurvature);
  
  // Draw the test lines (perfectly straight horizontals)
  int iLines = int(lines);
  for (int li = -6; li <= 6; li++) {
    float fi = float(li);
    if (abs(fi) > lines * 0.5) continue;
    float y = fi * spacing;
    float d = abs(uv.y - y);
    float line = smoothstep(0.008, 0.003, d);
    
    // Only draw in a horizontal band
    float bandMask = step(-0.85, uv.x) * step(uv.x, 0.85);
    col = mix(col, uColor2, line * bandMask);
  }
  
  gl_FragColor = vec4(col, 1.0);
}
