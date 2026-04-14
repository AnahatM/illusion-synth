uniform float uTime;
uniform float uOffset;
uniform float uTileCount;
uniform float uContrast;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float row = floor(uv.y * uTileCount);
  float rowOffset = mod(row, 2.0) * uOffset / uTileCount;

  float col = fract((uv.x + rowOffset) * uTileCount);
  float tile = step(0.5, col);

  // Mortar lines between rows
  float mortar = smoothstep(0.0, 0.02, fract(uv.y * uTileCount)) *
                 smoothstep(1.0, 0.98, fract(uv.y * uTileCount));

  float dark = mix(0.5 - uContrast * 0.5, 0.0, uContrast);
  float light = mix(0.5 + uContrast * 0.5, 1.0, uContrast);

  float brightness = mix(dark, light, tile);

  // Grey mortar
  brightness = mix(0.5, brightness, mortar);

  // Subtle animation: slowly shift offset
  float animOffset = sin(uTime * 0.3) * 0.1;
  float col2 = fract((uv.x + rowOffset + animOffset) * uTileCount);
  float tile2 = step(0.5, col2);
  float b2 = mix(dark, light, tile2);
  brightness = mix(brightness, b2, 0.3);

  gl_FragColor = vec4(vec3(brightness), 1.0);
}
