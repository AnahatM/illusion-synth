uniform float uSurroundAngle;
uniform float uLineWidth;
uniform float uCenterSize;
uniform vec3 uCenterColor;
uniform vec3 uSurroundColor;
uniform float uLineCount;
uniform float uBlur;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;

  float cSize = uCenterSize * 0.06;
  float sAngle = uSurroundAngle * 0.0174533;
  float freq = uLineCount * 45.0;
  // Blur controls the power curve on the sinusoid - lower = sharper edges
  float sharpness = mix(1.0, 0.15, uBlur);

  vec3 bg = vec3(0.0);
  vec3 color = bg;

  float dist = length(uv);

  // Surround region: annulus with grating
  float innerR = cSize + 0.005;
  float outerR = 0.38;
  if (dist > innerR && dist < outerR) {
    float cosA = cos(sAngle);
    float sinA = sin(sAngle);
    vec2 rotUv = vec2(uv.x * cosA - uv.y * sinA, uv.x * sinA + uv.y * cosA);
    float raw = sin(rotUv.x * freq) * 0.5 + 0.5;
    float grating = pow(raw, sharpness);
    float outerMask = smoothstep(outerR, outerR - 0.008, dist);
    float innerMask = smoothstep(innerR, innerR + 0.008, dist);
    color = mix(bg, uSurroundColor, grating * outerMask * innerMask);
  }

  // Center region: vertical grating (always 0 degrees)
  if (dist < cSize) {
    float raw = sin(uv.x * freq) * 0.5 + 0.5;
    float grating = pow(raw, sharpness);
    float mask = smoothstep(cSize, cSize - 0.008, dist);
    color = mix(bg, uCenterColor, grating * mask);
  }

  // Thin circle border between center and surround
  float borderW = 0.003;
  float cBorder = smoothstep(cSize - borderW, cSize, dist) * smoothstep(cSize + borderW, cSize, dist);
  color = mix(color, vec3(0.2), cBorder * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
