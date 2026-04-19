param(
  [string] $OutputApk = "",
  [string] $Keystore = "",
  [string] $KeyAlias = "androiddebugkey",
  [string] $StorePass = "android",
  [string] $KeyPass = "android",
  [int] $VersionCode = 1,
  [string] $VersionName = "1.0"
)

$ErrorActionPreference = "Stop"

$WrapperDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $WrapperDir
$SdkRoot = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT } elseif ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$BuildTools = Join-Path $SdkRoot "build-tools\36.1.0"
$PlatformJar = Join-Path $SdkRoot "platforms\android-36.1\android.jar"
$JavaHome = "C:\Program Files\Android\Android Studio\jbr"
$Java = Join-Path $JavaHome "bin\java.exe"
$Javac = Join-Path $JavaHome "bin\javac.exe"
$Jar = Join-Path $JavaHome "bin\jar.exe"
$Keytool = Join-Path $JavaHome "bin\keytool.exe"
$Aapt2 = Join-Path $BuildTools "aapt2.exe"
$D8 = Join-Path $BuildTools "d8.bat"
$Zipalign = Join-Path $BuildTools "zipalign.exe"
$Apksigner = Join-Path $BuildTools "apksigner.bat"

foreach ($tool in @($PlatformJar, $Java, $Javac, $Jar, $Keytool, $Aapt2, $D8, $Zipalign, $Apksigner)) {
  if (!(Test-Path $tool)) { throw "No encuentro herramienta necesaria: $tool" }
}

if (!$OutputApk) {
  $OutputApk = Join-Path $ProjectRoot "ESTO ES LA APP\kawaii-mixer-game-debug.apk"
}

$TempRoot = Join-Path $env:TEMP "kmg-android-build"
$SrcMain = Join-Path $WrapperDir "src\main"
$WorkMain = Join-Path $TempRoot "src\main"
$WebAssets = Join-Path $WorkMain "assets\www"
$CompiledRes = Join-Path $TempRoot "compiled-res"
$Generated = Join-Path $TempRoot "generated"
$Classes = Join-Path $TempRoot "classes"
$Dex = Join-Path $TempRoot "dex"
$UnsignedApk = Join-Path $TempRoot "kawaii-mixer-unsigned.apk"
$AlignedApk = Join-Path $TempRoot "kawaii-mixer-aligned.apk"

Remove-Item -LiteralPath $TempRoot -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $WebAssets, $CompiledRes, $Generated, $Classes, $Dex | Out-Null
Copy-Item -Path (Join-Path $SrcMain "*") -Destination $WorkMain -Recurse -Force

foreach ($item in @("index.html", "css", "data", "js", "assets")) {
  Copy-Item -Path (Join-Path $ProjectRoot $item) -Destination $WebAssets -Recurse -Force
}

& $Aapt2 compile --dir (Join-Path $WorkMain "res") -o $CompiledRes
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile falló" }

$LinkArgs = @(
  "link",
  "-o", $UnsignedApk,
  "--manifest", (Join-Path $WorkMain "AndroidManifest.xml"),
  "-I", $PlatformJar,
  "-A", (Join-Path $WorkMain "assets"),
  "--java", $Generated,
  "--min-sdk-version", "23",
  "--target-sdk-version", "36",
  "--version-code", "$VersionCode",
  "--version-name", $VersionName,
  "--auto-add-overlay"
)

Get-ChildItem -Path $CompiledRes -Recurse -Filter *.flat | ForEach-Object {
  $LinkArgs += @("-R", $_.FullName)
}

& $Aapt2 @LinkArgs
if ($LASTEXITCODE -ne 0) { throw "aapt2 link falló" }

$JavaFiles = @()
$JavaFiles += Get-ChildItem -Path (Join-Path $WorkMain "java") -Recurse -Filter *.java | ForEach-Object { $_.FullName }
$JavaFiles += Get-ChildItem -Path $Generated -Recurse -Filter *.java | ForEach-Object { $_.FullName }

& $Javac -encoding UTF-8 -source 11 -target 11 -classpath $PlatformJar -d $Classes @JavaFiles
if ($LASTEXITCODE -ne 0) { throw "javac falló" }

$ClassFiles = Get-ChildItem -Path $Classes -Recurse -Filter *.class | ForEach-Object { $_.FullName }
& $D8 --lib $PlatformJar --min-api 23 --output $Dex @ClassFiles
if ($LASTEXITCODE -ne 0) { throw "d8 falló" }

Push-Location $Dex
try {
  & $Jar uf $UnsignedApk "classes.dex"
  if ($LASTEXITCODE -ne 0) { throw "jar falló al añadir classes.dex" }
} finally {
  Pop-Location
}

& $Zipalign -f -p 4 $UnsignedApk $AlignedApk
if ($LASTEXITCODE -ne 0) { throw "zipalign falló" }

$SigningMode = "release"
if (!$Keystore) {
  $SigningMode = "debug"
  $AndroidHome = Join-Path $env:USERPROFILE ".android"
  $Keystore = Join-Path $AndroidHome "debug.keystore"
  $KeyAlias = "androiddebugkey"
  $StorePass = "android"
  $KeyPass = "android"
  if (!(Test-Path $Keystore)) {
    New-Item -ItemType Directory -Force -Path $AndroidHome | Out-Null
    & $Keytool -genkeypair -keystore $Keystore -storepass android -keypass android -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
    if ($LASTEXITCODE -ne 0) { throw "No se pudo crear debug.keystore" }
  }
} elseif (!(Test-Path $Keystore)) {
  throw "No encuentro el keystore release: $Keystore"
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $OutputApk) | Out-Null
& $Apksigner sign --ks $Keystore --ks-key-alias $KeyAlias --ks-pass "pass:$StorePass" --key-pass "pass:$KeyPass" --out $OutputApk $AlignedApk
if ($LASTEXITCODE -ne 0) { throw "apksigner falló" }

& $Apksigner verify --verbose --print-certs $OutputApk
if ($LASTEXITCODE -ne 0) { throw "La verificación de firma falló" }

Write-Output "APK generado ($SigningMode): $OutputApk"
