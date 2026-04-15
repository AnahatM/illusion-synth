uniform float uTime;
uniform float uSpeed;
uniform float uDotSpacing;
uniform float uISI;
uniform vec3 uDotColor;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 color = uBgColor;

  float dotR = 0.03;
  float spacing = uDotSpacing * 0.12;

  // Three dots in a row
  // Ternus display alternates between two frames:
  // Frame 1: dots at positions 1, 2, 3
  // Frame 2: dots at positions 2, 3, 4
  // With short ISI: element motion (dot 1 jumps to 4)
  // With long ISI: group motion (all three shift right)

  float cycle = uSpeed * 0.8;
  float t = mod(uTime * cycle, 2.0);
  float frame = step(1.0, t);

  // Blank interval between frames
  float isi = uISI * 0.15;
  float frameT = mod(t, 1.0);
  float visible = step(isi, frameT);

  // Dot positions
  float baseX = 0.5 - spacing * 1.5;
  float yPos = 0.5;

  for (float i = 0.0; i < 4.0; i++) {
    float x = baseX + i * spacing;
    // Frame 0: dots 0, 1, 2
    // Frame 1: dots 1, 2, 3
    float inFrame0 = step(0.5, 1.0 - frame) * step(i, 2.5);
    float inFrame1 = step(0.5, frame) * step(0.5, i);

    float show = (inFrame0 + inFrame1) * visible;
    show = clamp(show, 0.0, 1.0);

    float d = length(uv - vec2(x, yPos));
    float dot = (1.0 - smoothstep(dotR - 0.005, dotR, d)) * show;
    color = mix(color, uDotColor, dot);
  }

  gl_FragColor = vec4(color, 1.0);
}
