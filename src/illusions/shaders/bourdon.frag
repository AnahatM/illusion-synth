uniform vec3 uShapeColor;
uniform vec3 uBgColor;
uniform float uAngle;
uniform float uWidth;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;

  float rotAngle = uAngle;
  float ca = cos(rotAngle);
  float sa = sin(rotAngle);
  uv = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);

  float w = uWidth * 0.12;
  float halfH = 0.35;

  float shape = 0.0;

  // Upper triangle: narrow at center (y=0), widens to the right as y increases
  if (uv.y > 0.0 && uv.y < halfH) {
    float t = uv.y / halfH;
    float leftEdge = 0.0;
    float rightEdge = w * t;
    if (uv.x > leftEdge && uv.x < rightEdge) shape = 1.0;
  }

  // Lower triangle: narrow at center (y=0), widens to the right as y decreases
  if (uv.y < 0.0 && uv.y > -halfH) {
    float t = -uv.y / halfH;
    float leftEdge = 0.0;
    float rightEdge = w * t;
    if (uv.x > leftEdge && uv.x < rightEdge) shape = 1.0;
  }

  vec3 color = mix(uBgColor, uShapeColor, shape);
  gl_FragColor = vec4(color, 1.0);
}
