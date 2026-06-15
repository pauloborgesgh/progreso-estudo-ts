type AudioNodeRef = {
  ctx: AudioContext;
  src: AudioBufferSourceNode | OscillatorNode;
  gain: GainNode;
};

let current: AudioNodeRef | null = null;

function createNoiseBuffer(ctx: AudioContext, type: "white" | "pink" | "brown") {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "white") {
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  } else {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (type === "pink") {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        b0 = 0.9 * b0 + white * 0.1;
        data[i] = b0 * 0.5;
      }
    }
  }
  return buffer;
}

export function playTrack(id: string) {
  stopTrack();

  const ctx = new AudioContext();
  let src: AudioBufferSourceNode | OscillatorNode;
  const gain = ctx.createGain();
  gain.gain.value = 0.4;
  gain.connect(ctx.destination);

  if (id === "binaural") {
    // Binaural beats — two slightly detuned sine waves
    const left = ctx.createOscillator();
    left.type = "sine";
    left.frequency.value = 200;

    const right = ctx.createOscillator();
    right.type = "sine";
    right.frequency.value = 210; // 10Hz difference = alpha waves

    const merger = ctx.createChannelMerger(2);
    left.connect(merger, 0, 0);
    right.connect(merger, 0, 1);
    merger.connect(gain);

    left.start();
    right.start();
    src = left; // just a reference
  } else {
    const noiseType = id as "white" | "pink" | "brown";
    const buffer = createNoiseBuffer(ctx, noiseType);
    src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.connect(gain);
    src.start();
  }

  current = { ctx, src, gain };
}

export function stopTrack() {
  if (current) {
    try { current.src.stop(); } catch { /* ignore */ }
    try { current.ctx.close(); } catch { /* ignore */ }
    current = null;
  }
}

export function setVolume(v: number) {
  if (current) {
    current.gain.gain.value = Math.max(0, Math.min(1, v));
  }
}

export function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    osc.onended = () => ctx.close();
  } catch { /* ignore */ }
}
