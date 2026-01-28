# Generate Sound
1. Creating Virtual Environment
```bash
$ cd www/sounds
$ python -m venv env
```

2. Activate Virtual Environment
```bash
$ source env/bin/activate
(env) $ pip install --upgrade pip setuptools
(env) $ pip install -r requirements.txt
```

3. Generate Sound
```bash
(env) $ python GeneratePiano.py
```

4. Deactivate Virtual Environment
```bash
(env) $ deactivate
```

5. Remove Virtual Environment
```bash
$ rm -rf env
```


# Init
```bash
npm install
```

# Debug using ELECTRON
```bash
npm run start:desktop
```

# Debug using AndroidStudio
```bash
# Create a new android folder
npx cap add android
# Reflect web assets
npx cap sync android
# Open Android Studio
npx cap open android
```

## Step 1: Creating a keystore
```bash
cd android
keytool -genkeypair -v -keystore piano.keystore -alias piano -keyalg RSA -keysize 2048 -validity 10000

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
cd android
./gradlew clean
./gradlew assembleRelease

zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-aligned.apk

apksigner sign --ks piano.keystore --ks-key-alias piano --out app/build/outputs/apk/release/piano.apk app/build/outputs/apk/release/app-release-aligned.apk
> Keystore password for signer #1: testpass

apksigner verify --verbose app/build/outputs/apk/release/piano.apk
```



