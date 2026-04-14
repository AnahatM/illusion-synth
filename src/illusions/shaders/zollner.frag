uniform float uLineCount;
uniform float uHatchAngle;
uniform float uHatchDensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.15);

  float lineCount = uLineCount;
  float lineSpacing = 1.0 / lineCount;
  float lineW = 0.003;

  for (float i = 0.0; i < 20.0; i++) {
    if (i >= lineCount) break;
    float y = (i + 0.5) * lineSpacing;
    float dist = abs(uv.y - y);
    if (dist < lineW) {
      col = uColor1;
    }
  }

  float hatchAngle = uHatchAngle * PI / 180.0;
  float hatchLen = lineSpacing * 0.4;

  for (float i = 0.0; i < 20.0; i++) {
    if (i >= lineCount) break;
    float y = (i + 0.5) * lineSpacing;

    float angle = mod(i, 2.0) < 1.0 ? hatchAngle : -hatchAngle;

    float hatchCols = uHatchDensity * 8.0;
    for (float j = 0.0; j < 80.0; j++) {
      if (j >= hatchCols) break;
      float x = (j + 0.5) / hatchCols;
      vec2 center = vec2(x, y);
      vec2 d = uv - center;

      vec2 rd = vec2(
        d.x * cos(angle) + d.y * sin(angle),
        -d.x * sin(angle) + d.y * cos(angle)
      );

      if (abs(rd.x) < 0.002 && abs(rd.y) < hatchLen) {
        col = uColor2;
      }
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
