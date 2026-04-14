uniform float uStripeFreq;
uniform float uBarWidth;
uniform float uShowProof;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Horizontal stripes alternating black and white
  float stripe = step(0.5, fract(uv.y * uStripeFreq));

  float barW = uBarWidth * 0.06;
  float barGray = 0.5;

  // Left bar: centered at x=0.25
  float leftBar = step(0.25 - barW, uv.x) * (1.0 - step(0.25 + barW, uv.x));
  // Right bar: centered at x=0.75
  float rightBar = step(0.75 - barW, uv.x) * (1.0 - step(0.75 + barW, uv.x));

  // Left half stripes are normal (white on top), right half inverted
  float leftStripe = stripe;
  float rightStripe = 1.0 - stripe;

  // Select stripe phase based on half
  float isRight = step(0.5, uv.x);
  float s = mix(leftStripe, rightStripe, isRight);

  vec3 col = vec3(s);

  // Draw the gray bars — only visible in the stripe gaps
  float leftBarVis = leftBar * (1.0 - leftStripe);
  float rightBarVis = rightBar * rightStripe;

  col = mix(col, vec3(barGray), leftBarVis);
  col = mix(col, vec3(barGray), rightBarVis);

  // Proof mode: remove stripes, show bars on neutral gray background
  if (uShowProof > 0.5) {
    vec3 proofCol = vec3(0.35);
    // Show both bars on identical neutral background
    float anyBar = max(leftBar, rightBar);
    proofCol = mix(proofCol, vec3(barGray), anyBar);

    // Connecting strip between bars
    float stripY = step(0.45, uv.y) * step(uv.y, 0.55);
    float stripX = step(0.25 + barW, uv.x) * step(uv.x, 0.75 - barW);
    proofCol = mix(proofCol, vec3(barGray), stripY * stripX);

    col = proofCol;
  }

  gl_FragColor = vec4(col, 1.0);
}
