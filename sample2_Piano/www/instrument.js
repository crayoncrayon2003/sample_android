/**
 * Instrument - 楽器の基底クラス
 */
class Instrument {
  constructor(name, audioEngine) {
    this.name = name;
    this.engine = audioEngine;
    this.sounds = new Map();
  }

  async load() {
    console.log(`Loading ${this.name}...`);
    await this.engine.loadSounds(this.sounds);
  }

  play(soundName, options) {
    return this.engine.play(soundName, options);
  }

  stop(soundName) {
    this.engine.stop(soundName);
  }
}

/**
 * Piano - ピアノクラス
 */
class Piano extends Instrument {
  constructor(audioEngine) {
    super('Piano', audioEngine);

    // 音源マッピング
    this.notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

    this.notes.forEach(note => {
      this.sounds.set(note, `sounds/${note}.wav`);
    });
  }

  playNote(note) {
    return this.play(note, {
      volume: 0.5,
      fadeOut: 0.05
    });
  }

  stopNote(note) {
    this.stop(note);
  }

  getNotes() {
    return this.notes;
  }
}

/**
 * DrumKit - ドラムキットクラス
 */
class DrumKit extends Instrument {
  constructor(audioEngine) {
    super('DrumKit', audioEngine);

    // 音源マッピング
    this.drums = ['Kick', 'Snare', 'HiHat'];

    this.drums.forEach(drum => {
      this.sounds.set(drum, `sounds/${drum}.wav`);
    });
  }

  hit(drumName) {
    return this.play(drumName, {
      volume: 0.6,
      fadeOut: 0.01  // ドラムは短いフェードアウト
    });
  }

  getDrums() {
    return this.drums;
  }
}

// グローバルインスタンスを作成
const piano = new Piano(audioEngine);
const drumKit = new DrumKit(audioEngine);