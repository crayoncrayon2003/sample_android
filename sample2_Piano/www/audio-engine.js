/**
 * AudioEngine - 音源の読み込みと再生を管理
 */
class AudioEngine {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.buffers = new Map();
    this.activeSources = new Map();
  }

  /**
   * 音源ファイルを読み込む
   */
  async loadSound(name, path) {
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const arrayBuffer = await res.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      this.buffers.set(name, audioBuffer);
      console.log(`✓ ${name} loaded`);
      return true;
    } catch (err) {
      console.error(`✗ ${name} failed:`, err);
      return false;
    }
  }

  /**
   * 複数の音源を一括読み込み
   */
  async loadSounds(soundMap) {
    const promises = Array.from(soundMap.entries()).map(([name, path]) =>
      this.loadSound(name, path)
    );
    await Promise.all(promises);
  }

  /**
   * 音を再生
   */
  play(name, options = {}) {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.error(`${name} buffer not loaded`);
      return null;
    }

    // AudioContextを再開
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // 既存の音源があれば停止
    if (this.activeSources.has(name)) {
      this.stop(name);
    }

    // デフォルトオプション
    const {
      volume = 0.5,
      loop = false,
      fadeOut = 0.05
    } = options;

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;

      const gainNode = this.ctx.createGain();
      gainNode.gain.value = volume;

      source.connect(gainNode).connect(this.ctx.destination);

      // 終了時のクリーンアップ
      source.onended = () => {
        this.activeSources.delete(name);
      };

      source.start(0);

      this.activeSources.set(name, {
        source,
        gainNode,
        fadeOut
      });

      return { source, gainNode };
    } catch (err) {
      console.error(`Play error (${name}):`, err);
      return null;
    }
  }

  /**
   * 音を停止（フェードアウト付き）
   */
  stop(name) {
    const active = this.activeSources.get(name);
    if (!active) return;

    const { source, gainNode, fadeOut } = active;
    const currentTime = this.ctx.currentTime;

    try {
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + fadeOut);
      source.stop(currentTime + fadeOut);
    } catch (err) {
      console.error(`Stop error (${name}):`, err);
    }

    this.activeSources.delete(name);
  }

  /**
   * すべての音を停止
   */
  stopAll() {
    this.activeSources.forEach((_, name) => this.stop(name));
  }

  /**
   * 特定の音が再生中か確認
   */
  isPlaying(name) {
    return this.activeSources.has(name);
  }
}

// グローバルインスタンスを作成
const audioEngine = new AudioEngine();