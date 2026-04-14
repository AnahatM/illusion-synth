uniform float uOffset;
uniform float uRows;
uniform float uTilesPerRow;
uniform float uMortarWidth;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Number of rows and tiles
  float rows = uRows;
  float tilesPerRow = uTilesPerRow;

  // Row height includes mortar
  float rowH = 1.0 / rows;
  float mortarH = uMortarWidth * 0.004;

  // Which row are we in?
  float rowIndex = floor(uv.y / rowH);
  float yInRow = fract(uv.y / rowH);

  // Mortar lines: thin gray lines at top and bottom of each row
  float mortarFrac = mortarH / rowH;
  float isMortar = 1.0 - step(mortarFrac, yInRow) * step(yInRow, 1.0 - mortarFrac);

  // Tile width
  float tileW = 1.0 / tilesPerRow;

  // Each row offset by half a tile alternating
  float shift = mod(rowIndex, 2.0) * uOffset * tileW;
  float xShifted = uv.x + shift;

  // Which tile column?
  float tileCol = floor(xShifted / tileW);
  float tile = mod(tileCol, 2.0); // 0 = black, 1 = white

  // Pure black and white tiles
  float brightness = tile;

  // Apply mortar: gray line between rows
  // Mortar color is medium gray (0.5) — this is crucial for the illusion
  brightness = mix(brightness, 0.5, isMortar);

  gl_FragColor = vec4(vec3(brightness), 1.0);
}
