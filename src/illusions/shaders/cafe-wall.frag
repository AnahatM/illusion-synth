uniform float uOffset;
uniform float uRows;
uniform float uTilesPerRow;
uniform float uMortarWidth;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float rows = uRows;
  float tilesPerRow = uTilesPerRow;

  float rowH = 1.0 / rows;
  float mortarH = uMortarWidth * 0.004;

  float rowIndex = floor(uv.y / rowH);
  float yInRow = fract(uv.y / rowH);

  float mortarFrac = mortarH / rowH;
  float isMortar = 1.0 - step(mortarFrac, yInRow) * step(yInRow, 1.0 - mortarFrac);

  float tileW = 1.0 / tilesPerRow;

  float shift = mod(rowIndex, 2.0) * uOffset * tileW;
  float xShifted = uv.x + shift;

  float tileCol = floor(xShifted / tileW);
  float tile = mod(tileCol, 2.0);

  vec3 tileColor = mix(uColor1, uColor2, tile);
  vec3 mortarColor = (uColor1 + uColor2) * 0.5;

  vec3 color = mix(tileColor, mortarColor, isMortar);

  gl_FragColor = vec4(color, 1.0);
}
