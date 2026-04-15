uniform vec3 uOuterColor;
uniform vec3 uInnerColor;
uniform vec3 uBgColor;
uniform float uWaviness;
uniform float uContourWidth;
uniform float uShapeCount;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 color = uBgColor;

  for (float s = 0.0; s < 4.0; s++) {
    if (s >= uShapeCount) break;
    vec2 center = vec2(0.25 + mod(s, 2.0) * 0.5, 0.25 + floor(s / 2.0) * 0.5);
    vec2 d = uv - center;
    float angle = atan(d.y, d.x);
    float r = length(d);

    // Wavy contour
    float freq = 8.0 + s * 2.0;
    float wave = uWaviness * 0.015 * sin(freq * angle + s * 1.5);
    float baseR = 0.15;
    float contourR = baseR + wave;
    float distToContour = r - contourR;

    // Outer dark line
    float outerW = uContourWidth * 0.006;
    float outer = 1.0 - smoothstep(0.0, outerW * 0.5, abs(distToContour));

    // Inner colored line (slightly inside)
    float innerOffset = outerW * 0.8;
    float innerW = outerW * 0.7;
    float inner = 1.0 - smoothstep(0.0, innerW * 0.5, abs(distToContour + innerOffset));

    // Apply lines — outer is dark version of inner, inner is the color
    color = mix(color, uOuterColor * 0.3, outer * 0.9);
    color = mix(color, uInnerColor, inner * 0.7);
  }

  gl_FragColor = vec4(color, 1.0);
}
