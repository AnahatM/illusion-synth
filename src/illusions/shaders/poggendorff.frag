uniform float uRectWidth;
uniform float uLineOffset;
uniform vec3 uLineColor;
uniform vec3 uRectColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.15); // dark bg

  // Central rectangle
  float rectW = uRectWidth * 0.1;
  float rectH = 0.35;
  vec2 center = vec2(0.5, 0.5);

  float inRect = step(center.x - rectW, uv.x) * (1.0 - step(center.x + rectW, uv.x)) *
                 step(center.y - rectH, uv.y) * (1.0 - step(center.y + rectH, uv.y));

  // Gray rectangle
  col = mix(col, uRectColor, inRect);

  // Diagonal line behind the rectangle — from bottom-left to top-right
  float lineAngle = 0.6;
  float offset = uLineOffset * 0.01;

  // Line equation: y = mx + b
  // Left segment
  float m = lineAngle;
  float lineW = 0.004;

  // Left side line
  float leftY = 0.3 + m * (uv.x - 0.2);
  float leftLine = smoothstep(lineW, lineW * 0.3, abs(uv.y - leftY));
  float leftMask = step(uv.x, center.x - rectW) * step(0.1, uv.x);

  // Right side line — shifted up slightly to create misalignment perception
  float rightY = 0.3 + m * (uv.x - 0.2) + offset;
  float rightLine = smoothstep(lineW, lineW * 0.3, abs(uv.y - rightY));
  float rightMask = step(center.x + rectW, uv.x) * (1.0 - step(0.9, uv.x));

  // Actually both lines are perfectly aligned (offset=0), but the rectangle makes them look misaligned
  col = mix(col, uLineColor, leftLine * leftMask);
  col = mix(col, uLineColor, rightLine * rightMask);

  // Draw rectangle border
  float borderW = 0.003;
  float onBorder = step(abs(uv.x - (center.x - rectW)), borderW) + step(abs(uv.x - (center.x + rectW)), borderW);
  onBorder *= step(center.y - rectH, uv.y) * (1.0 - step(center.y + rectH, uv.y));
  float onBorderH = step(abs(uv.y - (center.y - rectH)), borderW) + step(abs(uv.y - (center.y + rectH)), borderW);
  onBorderH *= step(center.x - rectW, uv.x) * (1.0 - step(center.x + rectW, uv.x));

  col = mix(col, vec3(0.5), clamp(onBorder + onBorderH, 0.0, 1.0));

  gl_FragColor = vec4(col, 1.0);
}
