uniform float uTime;
uniform float uSpeed;
uniform float uDetail;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 col = vec3(0.85);

  float t = uTime * uSpeed;

  // Silhouette of a figure (simplified as an articulated stick figure / ellipse composite)
  // Body center
  float bodyX = 0.0;
  float bodyY = 0.05;

  // Head
  vec2 headPos = vec2(bodyX, bodyY + 0.15);
  float head = smoothstep(0.04, 0.035, length(uv - headPos));

  // Torso
  float torsoH = 0.12;
  float torsoW = 0.03;
  float torso = smoothstep(torsoW, torsoW * 0.7, abs(uv.x - bodyX)) *
                step(bodyY, uv.y) * step(uv.y, bodyY + torsoH);

  // Legs — rotating
  float legLen = 0.14;
  float legW = 0.015;
  float legAngle1 = sin(t) * 0.4;
  float legAngle2 = sin(t + PI) * 0.4;

  vec2 hipPos = vec2(bodyX, bodyY);

  // Leg 1
  vec2 leg1Dir = vec2(sin(legAngle1), -cos(legAngle1));
  vec2 leg1End = hipPos + leg1Dir * legLen;
  // Point-to-line distance
  vec2 d1 = uv - hipPos;
  float t1 = clamp(dot(d1, leg1Dir), 0.0, legLen);
  float dist1 = length(d1 - leg1Dir * t1);
  float leg1 = smoothstep(legW, legW * 0.5, dist1) * step(uv.y, hipPos.y + 0.01);

  // Leg 2
  vec2 leg2Dir = vec2(sin(legAngle2), -cos(legAngle2));
  float t2 = clamp(dot(uv - hipPos, leg2Dir), 0.0, legLen);
  float dist2 = length((uv - hipPos) - leg2Dir * t2);
  float leg2 = smoothstep(legW, legW * 0.5, dist2) * step(uv.y, hipPos.y + 0.01);

  // Arms — rotating opposite to legs
  float armLen = 0.1;
  float armW = 0.012;
  vec2 shoulderPos = vec2(bodyX, bodyY + 0.11);
  float armAngle1 = sin(t + PI) * 0.5;
  float armAngle2 = sin(t) * 0.5;

  vec2 arm1Dir = vec2(sin(armAngle1), -cos(armAngle1) * 0.3 - 0.7);
  float ta1 = clamp(dot(uv - shoulderPos, normalize(arm1Dir)), 0.0, armLen);
  float dista1 = length((uv - shoulderPos) - normalize(arm1Dir) * ta1);
  float arm1 = smoothstep(armW, armW * 0.5, dista1);

  vec2 arm2Dir = vec2(sin(armAngle2), -cos(armAngle2) * 0.3 - 0.7);
  float ta2 = clamp(dot(uv - shoulderPos, normalize(arm2Dir)), 0.0, armLen);
  float dista2 = length((uv - shoulderPos) - normalize(arm2Dir) * ta2);
  float arm2 = smoothstep(armW, armW * 0.5, dista2);

  // Composite silhouette
  float figure = max(max(max(head, torso), max(leg1, leg2)), max(arm1, arm2));
  col = mix(col, vec3(0.05), figure);

  gl_FragColor = vec4(col, 1.0);
}
