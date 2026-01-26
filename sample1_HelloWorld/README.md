# Init
```bash
npm init -y
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
keytool -genkeypair -v -keystore helloworld.keystore -alias helloworld -keyalg RSA -keysize 2048 -validity 10000

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

Step 2: Building a Signed APK
```
cd android
./gradlew clean
./gradlew assembleRelease

zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/app-release-aligned.apk

apksigner sign --ks helloworld.keystore --ks-key-alias helloworld --out app/build/outputs/apk/release/HelloWorld.apk app/build/outputs/apk/release/app-release-aligned.apk
> Keystore password for signer #1: testpass

apksigner verify --verbose app/build/outputs/apk/release/HelloWorld.apk


```