# Fixing Java Version in Android Studio

## ✅ Gradle is Now Configured
Gradle is now using Java 17. Verified by running `./gradlew --version`.

## Configure Android Studio IDE Settings

Android Studio has its own Java settings that might be causing the error. Follow these steps:

### 1. Configure Project SDK
1. Open **File → Project Structure** (or press `⌘;`)
2. In the left panel, click **SDK Location**
3. Set these paths:
   - **JDK location**: `/opt/homebrew/Cellar/openjdk@17/17.0.17`
   - **Android SDK location**: `~/Library/Android/sdk`

### 2. Configure Gradle Settings
1. Open **File → Settings** (or press `⌘,`)
2. Navigate to **Build, Execution, Deployment → Build Tools → Gradle**
3. Under **Gradle JVM**, select: **Project SDK (java 17)**
4. Or enter path: `/opt/homebrew/Cellar/openjdk@17/17.0.17`

### 3. Invalidate Caches and Restart
1. Click **File → Invalidate Caches / Restart**
2. Select **Invalidate and Restart**
3. Wait for Android Studio to restart

### 4. Sync Project
1. After restart, click **File → Sync Project with Gradle Files**
2. Wait for sync to complete

## Alternative: Quick Fix with Terminal

If Android Studio still has issues, build from terminal:

```bash
cd android
./gradlew assembleDebug
```

This will create the APK at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Verify Java Version

To confirm Gradle is using Java 17:
```bash
cd android
./gradlew --version
```

Should show:
```
JVM: 17.0.17 (Homebrew 17.0.17+0)
```

## If Error Persists in Android Studio

1. **Check Build Logs:**
   - View → Tool Windows → Build
   - Look for any Java version errors

2. **Gradle Daemon:**
   ```bash
   cd android
   ./gradlew --stop
   # Then restart Android Studio
   ```

3. **Clean Everything:**
   ```bash
   cd android
   ./gradlew clean
   rm -rf .gradle
   rm -rf build
   cd ..
   rm -rf node_modules/.cache
   ```

## Current Configuration

Your project is configured with:
- ✅ Gradle using Java 17
- ✅ Java 17 compile options set
- ✅ Gradle daemon stopped and restarted
- ✅ Build cache cleaned

The configuration files are:
- `android/build.gradle` - Added Java 17 compatibility
- `android/app/build.gradle` - Added compile options for Java 17
- `android/gradle.properties` - Set Java home to Java 17

## Next Steps

After configuring Android Studio settings:
1. Rebuild the project in Android Studio
2. The "Unsupported class file major version 65" error should be gone

