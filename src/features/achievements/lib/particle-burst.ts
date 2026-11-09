const PALETTE: Array<[number, number, number]> = [
  [0.85, 0.47, 0.34],
  [0.76, 0.37, 0.24],
  [0.31, 0.62, 0.41],
  [0.66, 0.46, 0.1],
  [0.54, 0.31, 0.63],
  [0.18, 0.5, 0.5],
];

export interface BurstHandle {
  cancel: () => void;
}

interface ParticleData {
  origins: Float32Array;
  angles: Float32Array;
  speeds: Float32Array;
  delays: Float32Array;
  lives: Float32Array;
  sizes: Float32Array;
  colors: Float32Array;
  maxLife: number;
}

function generateParticles(count: number, width: number, height: number): ParticleData {
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
  const origins = new Float32Array(count * 2);
  const angles = new Float32Array(count);
  const speeds = new Float32Array(count);
  const delays = new Float32Array(count);
  const lives = new Float32Array(count);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const cx = width / 2;
  const cy = height / 2;
  let maxLife = 0;

  for (let i = 0; i < count; i += 1) {
    origins[i * 2] = cx;
    origins[i * 2 + 1] = cy;

    const rightSector = i % 2 === 0;
    const degrees = rightSector
      ? Math.random() * 120 - 60
      : Math.random() * 120 + 120;
    angles[i] = (degrees * Math.PI) / 180;

    speeds[i] = (120 + Math.random() * 260) * dpr;
    delays[i] = Math.random() * 0.25;
    lives[i] = 1.6 + Math.random() * 1.2;
    sizes[i] = (4 + Math.random() * 6) * dpr;

    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    colors[i * 3] = color[0];
    colors[i * 3 + 1] = color[1];
    colors[i * 3 + 2] = color[2];

    maxLife = Math.max(maxLife, delays[i] + lives[i]);
  }

  return { origins, angles, speeds, delays, lives, sizes, colors, maxLife };
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl!.createShader(type);
  if (!shader) return null;
  gl!.shaderSource(shader, source);
  gl!.compileShader(shader);
  if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
    gl!.deleteShader(shader);
    return null;
  }
  return shader;
}

const VERTEX_SHADER = `
attribute vec2 a_origin;
attribute float a_angle;
attribute float a_speed;
attribute float a_delay;
attribute float a_life;
attribute float a_size;
attribute vec3 a_color;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_gravity;

varying vec3 v_color;
varying float v_alpha;

void main() {
  float t = u_time - a_delay;
  if (t < 0.0) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    gl_PointSize = 0.0;
    v_alpha = 0.0;
    v_color = a_color;
    return;
  }

  vec2 dir = vec2(cos(a_angle), sin(a_angle));
  vec2 pos = a_origin + dir * a_speed * t;
  pos.y += 0.5 * u_gravity * t * t;

  vec2 clip = (pos / u_resolution) * 2.0 - 1.0;
  clip.y = -clip.y;

  gl_Position = vec4(clip, 0.0, 1.0);

  float lifeRatio = 1.0 - (t / a_life);
  if (lifeRatio < 0.0) lifeRatio = 0.0;

  gl_PointSize = a_size * lifeRatio;
  v_color = a_color;
  v_alpha = lifeRatio;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec3 v_color;
varying float v_alpha;

void main() {
  vec2 pc = gl_PointCoord - vec2(0.5);
  if (length(pc) > 0.5) discard;
  gl_FragColor = vec4(v_color, v_alpha);
}
`;

function runWebGL(
  canvas: HTMLCanvasElement,
  data: ParticleData,
  width: number,
  height: number,
  dpr: number,
): BurstHandle {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: false,
  });

  if (!gl) {
    return runCanvas2D(canvas, data, width, height);
  }

  const vertexShader = createShader(gl, gl!.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl!.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) {
    return runCanvas2D(canvas, data, width, height);
  }

  const program = gl!.createProgram();
  if (!program) {
    return runCanvas2D(canvas, data, width, height);
  }

  gl!.attachShader(program, vertexShader);
  gl!.attachShader(program, fragmentShader);
  gl!.linkProgram(program);

  if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
    gl!.deleteProgram(program);
    return runCanvas2D(canvas, data, width, height);
  }

  gl!.useProgram(program);

  const attributeLocations = {
    origin: gl!.getAttribLocation(program, "a_origin"),
    angle: gl!.getAttribLocation(program, "a_angle"),
    speed: gl!.getAttribLocation(program, "a_speed"),
    delay: gl!.getAttribLocation(program, "a_delay"),
    life: gl!.getAttribLocation(program, "a_life"),
    size: gl!.getAttribLocation(program, "a_size"),
    color: gl!.getAttribLocation(program, "a_color"),
  };

  const uTime = gl!.getUniformLocation(program, "u_time");
  const uResolution = gl!.getUniformLocation(program, "u_resolution");
  const uGravity = gl!.getUniformLocation(program, "u_gravity");

  const buffers: WebGLBuffer[] = [];

  function bindAttribute(
    location: number,
    data: Float32Array,
    size: number,
  ): void {
    if (location < 0) return;
    const buffer = gl!.createBuffer();
    if (!buffer) return;
    buffers.push(buffer);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
    gl!.enableVertexAttribArray(location);
    gl!.vertexAttribPointer(location, size, gl!.FLOAT, false, 0, 0);
  }

  bindAttribute(attributeLocations.origin, data.origins, 2);
  bindAttribute(attributeLocations.angle, data.angles, 1);
  bindAttribute(attributeLocations.speed, data.speeds, 1);
  bindAttribute(attributeLocations.delay, data.delays, 1);
  bindAttribute(attributeLocations.life, data.lives, 1);
  bindAttribute(attributeLocations.size, data.sizes, 1);
  bindAttribute(attributeLocations.color, data.colors, 3);

  gl!.enable(gl!.BLEND);
  gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
  gl!.clearColor(0, 0, 0, 0);

  let rafId = 0;
  const start = performance.now();
  const gravity = 180 * dpr;

  function frame(now: number): void {
    const t = (now - start) / 1000;
    gl!.viewport(0, 0, width, height);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.useProgram(program);

    if (uTime) gl!.uniform1f(uTime, t);
    if (uResolution) gl!.uniform2f(uResolution, width, height);
    if (uGravity) gl!.uniform1f(uGravity, gravity);

    gl!.drawArrays(gl!.POINTS, 0, data.origins.length / 2);
    if (t < data.maxLife) {
      rafId = requestAnimationFrame(frame);
    }
  }

  rafId = requestAnimationFrame(frame);

  return {
    cancel: () => {
      if (rafId) cancelAnimationFrame(rafId);
      buffers.forEach((buffer) => gl!.deleteBuffer(buffer));
      gl!.deleteProgram(program);
      gl!.deleteShader(vertexShader);
      gl!.deleteShader(fragmentShader);
    },
  };
}

function runCanvas2D(
  canvas: HTMLCanvasElement,
  data: ParticleData,
  width: number,
  height: number,
): BurstHandle {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { cancel: () => {} };

  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
  canvas.width = width;
  canvas.height = height;

  const count = data.origins.length / 2;
  const originsX = new Array<number>(count);
  const originsY = new Array<number>(count);
  const angles = new Array<number>(count);
  const speeds = new Array<number>(count);
  const delays = new Array<number>(count);
  const lives = new Array<number>(count);
  const sizes = new Array<number>(count);
  const colors = new Array<string>(count);

  for (let i = 0; i < count; i += 1) {
    originsX[i] = data.origins[i * 2];
    originsY[i] = data.origins[i * 2 + 1];
    angles[i] = data.angles[i];
    speeds[i] = data.speeds[i];
    delays[i] = data.delays[i];
    lives[i] = data.lives[i];
    sizes[i] = data.sizes[i];
    colors[i] = `rgb(${Math.round(data.colors[i * 3] * 255)}, ${Math.round(
      data.colors[i * 3 + 1] * 255,
    )}, ${Math.round(data.colors[i * 3 + 2] * 255)})`;
  }

  const gravity = 180 * dpr;
  let rafId = 0;
  const start = performance.now();

  function frame(now: number): void {
    const t = (now - start) / 1000;
    ctx!.clearRect(0, 0, width, height);

    for (let i = 0; i < count; i += 1) {
      const pt = t - delays[i];
      if (pt < 0) continue;
      const ratio = 1 - pt / lives[i];
      if (ratio <= 0) continue;

      const x = originsX[i] + Math.cos(angles[i]) * speeds[i] * pt;
      const y =
        originsY[i] +
        Math.sin(angles[i]) * speeds[i] * pt +
        0.5 * gravity * pt * pt;

      ctx!.globalAlpha = ratio;
      ctx!.fillStyle = colors[i];
      ctx!.beginPath();
      ctx!.arc(x, y, sizes[i] * ratio, 0, Math.PI * 2);
      ctx!.fill();
    }

    ctx!.globalAlpha = 1;
    if (t < data.maxLife) {
      rafId = requestAnimationFrame(frame);
    }
  }

  rafId = requestAnimationFrame(frame);

  return {
    cancel: () => {
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}

export function runParticleBurst(
  canvas: HTMLCanvasElement,
  count: number,
): BurstHandle {
  if (count <= 0) return { cancel: () => {} };

  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
  const width = Math.max(1, Math.floor(window.innerWidth * dpr));
  const height = Math.max(1, Math.floor(window.innerHeight * dpr));

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  const data = generateParticles(count, width, height);
  return runWebGL(canvas, data, width, height, dpr);
}
