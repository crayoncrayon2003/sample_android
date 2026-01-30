let SERVER_URL = "http://127.0.0.1:8000"; // デフォルト値

export function setServerIP(ip) {
  SERVER_URL = `http://${ip}:8000`;
}

// Capacitor HTTPヘルパー関数
async function capacitorFetch(url, options = {}) {
  if (window.Capacitor && window.Capacitor.Plugins) {
    const { CapacitorHttp } = window.Capacitor.Plugins;

    try {
      const response = await CapacitorHttp.request({
        url: url,
        method: options.method || 'GET',
        headers: options.headers || {},
        responseType: options.responseType || 'text'
      });

      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      throw new Error(`HTTP Error: ${error.message}`);
    }
  } else {
    const response = await fetch(url, options);
    return {
      ok: response.ok,
      status: response.status,
      data: await response.blob()
    };
  }
}

// テキスト→音声
export async function tts(text) {
  const url = `${SERVER_URL}/tts?text=${encodeURIComponent(text)}`;

  if (window.Capacitor && window.Capacitor.Plugins) {
    const { CapacitorHttp } = window.Capacitor.Plugins;
    const response = await CapacitorHttp.get({
      url: url,
      responseType: 'blob'
    });

    if (response.data) {
      const base64Data = response.data.replace(/^data:audio\/\w+;base64,/, '');
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'audio/wav' });
    }
  }

  const res = await fetch(url);
  return await res.blob();
}

// ヘルスチェック用の関数
export async function healthCheck(ip) {
  const url = `http://${ip}:8000/health`;

  if (window.Capacitor && window.Capacitor.Plugins) {
    const { CapacitorHttp } = window.Capacitor.Plugins;

    try {
      const response = await CapacitorHttp.get({ url });
      return {
        success: true,
        status: response.status,
        message: `サーバ正常応答 (${response.status})`
      };
    } catch (error) {
      return {
        success: false,
        message: `接続失敗: ${error.message}`
      };
    }
  } else {
    try {
      const res = await fetch(url);
      return {
        success: res.ok,
        status: res.status,
        message: res.ok ? '💚 サーバ正常応答' : `❌ サーバエラー: ${res.status}`
      };
    } catch (err) {
      return {
        success: false,
        message: `❌ サーバ接続失敗: ${err.message}`
      };
    }
  }
}

// 音声再生
export function playAudio(blob) {
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
}

// マイク権限のリクエスト
export async function requestMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // 権限取得成功したらストリームを停止
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error("マイク権限エラー:", error);
    return false;
  }
}

// 音声認識
export function startSpeechRecognition(onResult, onError) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("音声認識非対応環境です");
    return;
  }

  const recognition = new SpeechRecognition();

  // 精度向上のための設定
  recognition.lang = "ja-JP,ja";                 // 日本語
  recognition.continuous = false;                // 連続認識しない（1回で終了）
  recognition.interimResults = false;            // 途中結果を取得しない（最終結果のみ）
  recognition.maxAlternatives = 1;               // 候補は1つのみ

  // 精度向上のための追加設定
  if (recognition.hasOwnProperty('grammars')) {
    // 文法ヒントがサポートされている場合（ブラウザ依存）
    recognition.grammars = null;
  }

  recognition.onresult = (e) => {
    if (e.results.length > 0) {
      const transcript = e.results[0][0].transcript;
      const confidence = e.results[0][0].confidence; // 信頼度（0-1）

      console.log(`認識結果: ${transcript}, 信頼度: ${confidence}`);

      // 信頼度が低い場合は警告（オプション）
      if (confidence < 0.5) {
        console.warn("認識精度が低い可能性があります");
      }

      onResult(transcript);
    }
  };

  recognition.onerror = (e) => {
    console.error("音声認識エラー:", e.error);
    onError(e.error);
  };

  recognition.onend = () => {
    console.log("音声認識終了");
  };

  recognition.start();
}