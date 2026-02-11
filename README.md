# Install
## Java
### Install Java

```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### Check Version

```bash
java -version
```

### Setting Environment variables

```bash
vim ~/.bashrc
```

Add the following at the end:

```bash
# Java
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
```

Apply settings

```bash
source ~/.bashrc
```

## NodeJS
### Install NodeJS

Install NodeJS
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Apply settings
```bash
source ~/.bashrc
```

Check Version
```bash
command -v nvm
```

Install NodeJS version 20
```bash
nvm install 20
```

### Check Version
```bash
node -v
npm -v
```

## Android Studio
### Confirm Prerequisites
Check that snap is installed

```bash
snap --version
```

If snap is not installed, these steps to install it:

```bash
sudo apt update
sudo apt install snapd
```

### Install Android Studio

```bash
sudo snap install android-studio --classic
```

### Check Version

```bash
snap list android-studio
```

### Setting Environment variables
```bash
vim ~/.bashrc
```

```bash
# Andoroid Studio
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Capacitor (Android Studio のパス)
export CAPACITOR_ANDROID_STUDIO_PATH=/snap/bin/android-studio
```

Apply settings

```bash
source ~/.bashrc
```

### Android Studio Initial Setup
start up android-studio

```bash
android-studio
```

1. Import Settings : For the first time, select `Do not import settings`
2. SDK Setup       : `Standard`
3. SDK Components  : Check the following
* `Android SDK`
* `Android SDK Platform-Tools`
* `Android Emulator`

check the location of the Android SDK

`File` > `Settings` > `Appearance & Behavior` > `System Settings` > `Android SDK`

## Android Build Tools
```bash
sudo apt install google-android-build-tools-34.0.0-installer
```
