# voicevox
```bash
cd voicevox

wget https://github.com/VOICEVOX/voicevox_engine/releases/download/0.25.1/voicevox_engine-linux-cpu-x64-0.25.1.vvpp
7z x voicevox_engine-linux-cpu-x64-0.25.1.vvpp

chmod +x run
./run
```

```bash
curl http://127.0.0.1:50021/version
```

# Backend Server
1. Creating Virtual Environment
```bash
$ cd backend
$ python -m venv env
```

2. Activate Virtual Environment
```bash
$ source env/bin/activate
(env) $ pip install --upgrade pip setuptools
(env) $ pip install -r requirements.txt
```

3. Start Server
```bash
(env) $ python server.py
```

4. Test
```bash
curl -G "http://127.0.0.1:8000/tts" --data-urlencode "text=こんにちは、まめなのだ" -o test.wav
```

play test.wav on any player


# Desktop
## Root Dir
```bash
cd electron
```

## Init
```bash
npm install
```

## Debug using ELECTRON
```bash
npm run start:desktop
```

# Mobile
## Root Dir
```bash
cd ..
```

## Init
```bash
npm install
```

## Debug using AndroidStudio

```bash
# Create a new android folder
npx cap add android
# Reflect web assets
npx cap sync android
# Open Android Studio
npx cap open android
```


## Step 0: Setting
### Set Android Permission
#### android/app/src/main/AndroidManifest.xml
```
<application
    ...
    android:usesCleartextTraffic="true">
    ...
</application>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.INTERNET" />
　　<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
</manifest>
```

#### android/app/src/main/res/xml/network_security_config.xml
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.0.5</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
    </domain-config>
</network-security-config>
```

### Set Local network
Change the local server's IP address to your environment.

* frontend/index.html
* frontend/main.js
* android/app/src/main/res/xml/network_security_config.xml

## Step 1: Creating a keystore
```bash
cd android
keytool -genkeypair -v -keystore bowtie.keystore -alias bowtie -keyalg RSA -keysize 2048 -validity 10000

> パスワード入力: testpass
> パスワード再入力: testpass
> 名前: [Enter]
> 部署: [Enter]
> 組織: [Enter]
> 市: [Enter]
> 都道府県: [Enter]
> 国コード: JP [Enter]
> 確認: yes [Enter]
```

## Step 2: Building a Signed APK
```bash
npx cap sync android

cd android
./gradlew clean
./gradlew assembleRelease

zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-aligned.apk

apksigner sign --ks bowtie.keystore --ks-key-alias bowtie --out app/build/outputs/apk/release/bowtie.apk app/build/outputs/apk/release/app-release-aligned.apk
> Keystore password for signer #1: testpass

apksigner verify --verbose app/build/outputs/apk/release/bowtie.apk
```


