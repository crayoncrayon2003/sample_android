import os
import numpy as np
from scipy.io import wavfile

def create_kick(sampling_rate, duration):
    """キック（バスドラム）の生成"""
    t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)
    # 周波数を150Hzから30Hzへ急降下させる
    freq_sweep = np.exp(-15 * t) * 120 + 30
    wave = np.sin(2 * np.pi * freq_sweep * t)
    # 音量を急激に減衰させる
    envelope = np.exp(-10 * t)
    return wave * envelope

def create_snare(sampling_rate, duration):
    """スネアドラムの生成"""
    t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)
    # ホワイトノイズと180Hzのサイン波をミックス
    noise = np.random.uniform(-1, 1, len(t))
    body = np.sin(2 * np.pi * 180 * t) * np.exp(-15 * t)
    wave = (noise * np.exp(-15 * t)) + body
    return wave * 0.5

def create_hihat(sampling_rate, duration):
    """ハイハットの生成"""
    t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)
    # 高域のノイズを非常に短く鳴らす
    noise = np.random.uniform(-1, 1, len(t))
    envelope = np.exp(-40 * t)
    return noise * envelope * 0.3

def save_wav(name, data, sampling_rate, root):
    """WAVファイルとして保存"""
    # 正規化（最大値を1.0に）
    max_val = np.max(np.abs(data))
    if max_val > 0:
        data = data / max_val * 0.8  # 音割れ防止のため0.8倍

    # 16bit PCM形式に変換
    audio_data_int = (data * 32767).astype(np.int16)
    file_path = os.path.join(root, f"{name}.wav")
    wavfile.write(file_path, sampling_rate, audio_data_int)
    print(f"作成完了: {name}.wav")

def main():
    ROOTDIR = os.path.dirname(os.path.abspath(__file__))
    sampling_rate = 44100
    duration = 0.5  # ドラムは0.5秒

    print(f"[ドラム音源] 出力先フォルダ: {ROOTDIR}\n")

    # ドラム音源の生成
    drums = {
        "Kick": create_kick(sampling_rate, duration),
        "Snare": create_snare(sampling_rate, duration),
        "HiHat": create_hihat(sampling_rate, duration)
    }

    for name, data in drums.items():
        save_wav(name, data, sampling_rate, ROOTDIR)

    print("\n[ドラム音源] すべてのWAVファイルの書き出しが成功しました。\n")

if __name__ == "__main__":
    main()