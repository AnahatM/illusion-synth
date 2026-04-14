uniform float uTime;
uniform float uPhase;
uniform float uDuration;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);

  // Phase: 0 = staring at color, 1 = seeing afterimage
  float cycle = mod(uTime, uDuration * 2.0);
  float isAfterimage = step(uDuration, cycle);

  // Cross/circle shape
  float shape = step(dist, 0.2);

  // Small fixation dot
  float dot = step(dist, 0.01);

  vec3 stareColor = uColor * shape;
  vec3 afterColor = (1.0 - uColor) * shape * 0.5; // complement

  vec3 bgStare = vec3(0.5);
  vec3 bgAfter = vec3(1.0);

  vec3 bg = mix(bgStare, bgAfter, isAfterimage);
  vec3 fg = mix(stareColor, afterColor, isAfterimage);

  vec3 color = mix(bg, fg, shape) + vec3(dot);

  // Pulsing border to indicate phase
  float border = smoothstep(0.48, 0.5, abs(uv.x)) + smoothstep(0.48, 0.5, abs(uv.y));
  vec3 borderColor = mix(vec3(0.2, 0.8, 0.2), vec3(0.8, 0.2, 0.2), isAfterimage);
  color = mix(color, borderColor, border * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
