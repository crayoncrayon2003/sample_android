import os
import numpy as np
from scipy.io import wavfile

def main():
    ROOTDIR = os.path.dirname(os.path.abspath(__file__))
    sampling_rate = 44100
    duration = 2.0

    # C4〜C5まで8音
    frequencies = {
        "C4": 261.63,
        "D4": 293.66,
        "E4": 329.63,
        "F4": 349.23,
        "G4": 392.00,
        "A4": 440.00,
        "B4": 493.88,
        "C5": 523.25
    }

    print(f"[ピアノ音源] 出力先フォルダ: {ROOTDIR}\n")

    for name, freq in frequencies.items():
        # 時間軸
        t = np.linspace(0, duration, int(sampling_rate * duration), endpoint=False)

        # 基本波形（サイン波）
        audio_data = np.sin(2 * np.pi * freq * t)

        # 倍音を追加（よりリアルな音に）
        audio_data += 0.3 * np.sin(2 * np.pi * freq * 2 * t)  # 2倍音
        audio_data += 0.2 * np.sin(2 * np.pi * freq * 3 * t)  # 3倍音

        # エンベロープ（ADSR）を適用
        attack_time = 0.01   # アタック: 10ms
        decay_time = 0.1     # ディケイ: 100ms
        sustain_level = 0.7  # サスティンレベル
        release_time = 0.3   # リリース: 300ms

        envelope = np.ones_like(t)

        # Attack
        attack_samples = int(attack_time * sampling_rate)
        envelope[:attack_samples] = np.linspace(0, 1, attack_samples)

        # Decay
        decay_samples = int(decay_time * sampling_rate)
        decay_end = attack_samples + decay_samples
        envelope[attack_samples:decay_end] = np.linspace(1, sustain_level, decay_samples)

        # Sustain
        sustain_end = len(t) - int(release_time * sampling_rate)
        envelope[decay_end:sustain_end] = sustain_level

        # Release
        envelope[sustain_end:] = np.linspace(sustain_level, 0, len(t) - sustain_end)

        # エンベロープを適用
        audio_data *= envelope

        # 音量を調整（音割れ防止）
        audio_data *= 0.3

        # 正規化
        max_val = np.max(np.abs(audio_data))
        if max_val > 0:
            audio_data = audio_data / max_val * 0.8

        # 16bit PCM形式に変換
        audio_data_int = (audio_data * 32767).astype(np.int16)

        # 出力
        file_path = os.path.join(ROOTDIR, f"{name}.wav")
        wavfile.write(file_path, sampling_rate, audio_data_int)
        print(f"作成完了: {name}.wav")

    print("\n[ピアノ音源] すべてのWAVファイルの書き出しが成功しました。\n")

if __name__ == "__main__":
    main()