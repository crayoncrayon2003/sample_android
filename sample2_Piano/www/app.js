/**
 * UIController - UI要素とイベントを管理
 */
class UIController {
  constructor() {
    this.pressedElements = new Set();
  }

  /**
   * 要素にイベントリスナーを設定
   */
  attachEvents(element, onPress, onRelease) {
    // マウスイベント
    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (this.pressedElements.has(element)) return;

      element.classList.add('pressed');
      this.pressedElements.add(element);
      onPress();
    });

    element.addEventListener('mouseup', () => {
      element.classList.remove('pressed');
      this.pressedElements.delete(element);
      if (onRelease) onRelease();
    });

    element.addEventListener('mouseleave', () => {
      if (!this.pressedElements.has(element)) return;
      element.classList.remove('pressed');
      this.pressedElements.delete(element);
      if (onRelease) onRelease();
    });

    // タッチイベント
    element.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.pressedElements.has(element)) return;

      element.classList.add('pressed');
      this.pressedElements.add(element);
      onPress();
    });

    element.addEventListener('touchend', (e) => {
      e.preventDefault();
      element.classList.remove('pressed');
      this.pressedElements.delete(element);
      if (onRelease) onRelease();
    });

    element.addEventListener('touchcancel', (e) => {
      e.preventDefault();
      element.classList.remove('pressed');
      this.pressedElements.delete(element);
      if (onRelease) onRelease();
    });
  }

  /**
   * すべてのpressed状態をクリア
   */
  clearAllPressed(callback) {
    this.pressedElements.forEach(el => {
      el.classList.remove('pressed');
    });
    this.pressedElements.clear();
    if (callback) callback();
  }
}

/**
 * App - アプリケーションのメインクラス
 */
class App {
  constructor() {
    this.ui = new UIController();
  }

  /**
   * ピアノUIをセットアップ
   */
  setupPiano() {
    document.querySelectorAll('.key').forEach(keyElement => {
      const note = keyElement.dataset.note;

      this.ui.attachEvents(
        keyElement,
        () => piano.playNote(note),      // 押した時
        () => piano.stopNote(note)       // 離した時
      );
    });

    console.log('✓ Piano UI setup complete');
  }

  /**
   * ドラムUIをセットアップ
   */
  setupDrums() {
    document.querySelectorAll('.drum').forEach(drumElement => {
      const drumName = drumElement.dataset.sound;

      this.ui.attachEvents(
        drumElement,
        () => drumKit.hit(drumName),     // 押した時
        null                             // 離した時は何もしない（自動減衰）
      );
    });

    console.log('✓ Drum UI setup complete');
  }

  /**
   * グローバルイベントをセットアップ
   */
  setupGlobalEvents() {
    // マウスが画面外に出た時、全てのピアノ音を停止
    document.addEventListener('mouseup', () => {
      piano.getNotes().forEach(note => {
        if (audioEngine.isPlaying(note)) {
          piano.stopNote(note);
        }
      });
    });

    console.log('✓ Global events setup complete');
  }

  /**
   * アプリケーションを初期化
   */
  async init() {
    console.log('🎵 Initializing Music App...\n');

    // 音源を読み込み
    await piano.load();
    await drumKit.load();

    // UIをセットアップ
    this.setupPiano();
    this.setupDrums();
    this.setupGlobalEvents();

    console.log('\n✅ App initialized successfully!');
  }
}

// アプリケーション起動
const app = new App();
app.init();