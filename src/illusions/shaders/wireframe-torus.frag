precision mediump float;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uMajor;
uniform float uMinor;
uniform int uSegments;

varying vec2 vUv;

const float PI = 3.14159265359;

float line(vec2 a, vec2 b, vec2 p, float w) {
    vec2 ab = b - a;
    float t = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
    return 1.0 - smoothstep(0.0, w, length(p - a - ab * t));
}

mat3 rotY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c,0,s, 0,1,0, -s,0,c);
}

mat3 rotX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1,0,0, 0,c,-s, 0,s,c);
}

void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    float aspect = 1.0;
    uv.x *= aspect;

    float t = uTime * uSpeed;
    mat3 rot = rotX(t * 0.7) * rotY(t);

    float R = uMajor * 0.3;
    float r = uMinor * 0.3;
    int seg = uSegments;
    float lineW = 0.003;

    float brightness = 0.0;

    // Draw rings around the tube (latitude-like)
    for (int i = 0; i < 24; i++) {
        if (i >= seg) break;
        float theta = float(i) * 2.0 * PI / float(seg);

        for (int j = 0; j < 24; j++) {
            if (j >= seg) break;
            float phi1 = float(j) * 2.0 * PI / float(seg);
            float phi2 = float(j + 1) * 2.0 * PI / float(seg);

            vec3 p1 = vec3(
                (R + r * cos(phi1)) * cos(theta),
                r * sin(phi1),
                (R + r * cos(phi1)) * sin(theta)
            );
            vec3 p2 = vec3(
                (R + r * cos(phi2)) * cos(theta),
                r * sin(phi2),
                (R + r * cos(phi2)) * sin(theta)
            );

            p1 = rot * p1;
            p2 = rot * p2;

            brightness += line(p1.xy, p2.xy, uv, lineW);
        }
    }

    // Draw rings around the torus (longitude-like)
    for (int i = 0; i < 24; i++) {
        if (i >= seg) break;
        float phi = float(i) * 2.0 * PI / float(seg);

        for (int j = 0; j < 24; j++) {
            if (j >= seg) break;
            float theta1 = float(j) * 2.0 * PI / float(seg);
            float theta2 = float(j + 1) * 2.0 * PI / float(seg);

            vec3 p1 = vec3(
                (R + r * cos(phi)) * cos(theta1),
                r * sin(phi),
                (R + r * cos(phi)) * sin(theta1)
            );
            vec3 p2 = vec3(
                (R + r * cos(phi)) * cos(theta2),
                r * sin(phi),
                (R + r * cos(phi)) * sin(theta2)
            );

            p1 = rot * p1;
            p2 = rot * p2;

            brightness += line(p1.xy, p2.xy, uv, lineW);
        }
    }

    brightness = clamp(brightness, 0.0, 1.0);
    gl_FragColor = vec4(uColor * brightness, brightness);
}
