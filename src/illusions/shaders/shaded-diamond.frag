uniform float uGradientStrength;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  vec2 d = uv - center;

  // Diamond shape (rotated square)
  float diamond = abs(d.x) + abs(d.y);
  float inDiamond = smoothstep(0.35, 0.345, diamond);

  // Background: split into light top and dark bottom
  float bgGrad = uv.y;
  vec3 bgColor = mix(uColor1 * 0.3, uColor2 * 0.9, bgGrad);

  // Diamond is uniform gray BUT appears to have a gradient
  // because of the background gradient (simultaneous contrast)
  float diamondLum = 0.5;
  vec3 diamondColor = mix(uColor1, uColor2, diamondLum);

  // Apply gradient strength to background
  vec3 bg = mix(vec3(0.5), bgColor, uGradientStrength);

  vec3 color = mix(bg, diamondColor, inDiamond);

  gl_FragColor = vec4(color, 1.0);
}
