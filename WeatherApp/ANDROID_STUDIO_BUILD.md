# Building with Android Studio

## Quick Start

### Option 1: Open from Android Studio
1. Open **Android Studio**
2. Click **File → Open**
3. Navigate to: `/Users/maulin.gajjar/workspace/sandbox/TestApp/WeatherApp/android`
4. Click **OK** to open the project

### Option 2: Open from Command Line
```bash
# From the WeatherApp directory
cd android
studio .  # Opens Android Studio (if installed via Homebrew/sdkman)

# Or use the full path
open -a "Android Studio" /Users/maulin.gajjar/workspace/sandbox/TestApp/WeatherApp/android
```

## Building in Android Studio

### Build Debug APK
1. In Android Studio, click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for the build to complete
3. The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK (for distribution)
1. Click **Build → Generate Signed Bundle / APK**
2. Select **APK** and click **Next**
3. Create or select a keystore (for production)
4. Or use the debug keystore for testing
5. Click **Next** and **Finish**

### Run on Emulator/Device
1. Start an Android emulator or connect a device
2. Click the **Run** button (▶️) in Android Studio
3. Or click **Run → Run 'app'**

## Important Notes

1. **First Time Setup:**
   - Android Studio will sync Gradle
   - It will download dependencies if needed
   - May take a few minutes on first run

2. **Requirements:**
   - JDK 11 or higher
   - Android SDK (installed with Android Studio)
   - Build Tools API 33

3. **SDK Location:**
   - Android Studio uses: `~/Library/Android/sdk`
   - Your project is configured to use this location

4. **Gradle Sync:**
   - If you see sync errors, click **File → Sync Project with Gradle Files**
   - Or click the elephant icon (🔄) in the toolbar

## Project Structure in Android Studio

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/...          # Java/Kotlin code
│   │   │   ├── res/               # Resources
│   │   │   └── AndroidManifest.xml
│   └── build.gradle               # App-level build config
├── build.gradle                    # Project-level build config
├── gradle/
├── gradlew                         # Gradle wrapper
└── settings.gradle
```

## Troubleshooting

### "SDK location not found"
- Go to **File → Project Structure → SDK Location**
- Set SDK location to: `/Users/maulin.gajjar/Library/Android/sdk`

### "Failed to sync Gradle"
- Click **File → Invalidate Caches / Restart**
- Select **Invalidate and Restart**

### Build Errors
- Clean and rebuild: **Build → Clean Project**, then **Build → Rebuild Project**

## Building from Terminal (Alternative)

If you prefer the command line:

```bash
# Build debug APK
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug

# Build release APK
./gradlew assembleRelease
```

## Output Location

After building, find your APK at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Size: ~54 MB (debug build)


