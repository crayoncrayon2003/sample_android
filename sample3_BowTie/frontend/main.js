import { tts, playAudio, startSpeechRecognition, setServerIP, healthCheck, requestMicrophonePermission } from "./app.js";

const voiceBtn = document.getElementById("voiceBtn");
const playBtn = document.getElementById("playBtn");
const textArea = document.getElementById("transcriptText");

const serverIpInput = document.getElementById("serverIp");
const saveIpBtn = document.getElementById("saveIpBtn");

const healthBtn = document.getElementById("healthBtn");
const healthStatus = document.getElementById("healthStatus");

// 初期サーバIP
serverIpInput.value = "192.168.0.5";
setServerIP(serverIpInput.value);

// -------------------------
// サーバIP変更ボタン
// -------------------------
saveIpBtn.addEventListener("click", () => {
  const ip = serverIpInput.value.trim();
  if (ip) {
    setServerIP(ip);
    alert(`サーバIPを ${ip} に変更しました`);
  }
});

// -------------------------
// 再生ボタン状態更新
// -------------------------
function updatePlayButton() {
  playBtn.disabled = textArea.value.trim().length === 0;
}

// -------------------------
// テキストボックスクリック時にクリア
// -------------------------
textArea.addEventListener("focus", () => {
  textArea.value = "";
  updatePlayButton();
});

// -------------------------
// 🎤 音声認識
// -------------------------
voiceBtn.addEventListener("click", async () => {
  voiceBtn.disabled = true;
  playBtn.disabled = true;

  const hasPermission = await requestMicrophonePermission();

  if (!hasPermission) {
    alert("マイクの権限が必要です。アプリの設定から権限を許可してください。");
    voiceBtn.disabled = false;
    playBtn.disabled = false;
    return;
  }

  startSpeechRecognition(
    async (text) => {
      textArea.value = text;
      updatePlayButton();

      try {
        const audioBlob = await tts(text);
        playAudio(audioBlob);
      } catch (error) {
        alert("音声変換エラー: " + error.message);
      }

      voiceBtn.disabled = false;
      playBtn.disabled = false;
    },
    (err) => {
      alert("音声認識エラー: " + err);
      voiceBtn.disabled = false;
      playBtn.disabled = false;
    }
  );
});

// -------------------------
// ▶ 手動読み上げ
// -------------------------
playBtn.addEventListener("click", async () => {
  const text = textArea.value.trim();
  if (!text) return;

  playBtn.disabled = true;
  voiceBtn.disabled = true;

  try {
    const audioBlob = await tts(text);
    playAudio(audioBlob);
  } catch (error) {
    alert("音声変換エラー: " + error.message);
  }
  
  playBtn.disabled = false;
  voiceBtn.disabled = false;
});

// -------------------------
// サーバ健康チェックボタン
// -------------------------
healthBtn.addEventListener("click", async () => {
  const ip = serverIpInput.value.trim();
  if (!ip) {
    alert("サーバIPを入力してください");
    return;
  }

  healthStatus.textContent = "接続中…";
  
  const result = await healthCheck(ip);
  
  if (result.success) {
    healthStatus.textContent = `💚 ${result.message}`;
  } else {
    healthStatus.textContent = `❌ ${result.message}`;
  }
});

// -------------------------
// テキスト入力対応（IME対応）
// -------------------------
textArea.addEventListener("input", updatePlayButton);
textArea.addEventListener("compositionend", updatePlayButton);

// 初期状態
updatePlayButton();