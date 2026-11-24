Add-Type -AssemblyName System.Drawing

$src = "C:\Users\chand\.gemini\antigravity\brain\babee076-3680-465e-bc89-97ac3a25ec70\.user_uploaded\media_1792953596308_4ae588f8.jpg"
$img = [System.Drawing.Image]::FromFile($src)

function Resize-Image($sourceImage, $width, $height, $targetPath) {
    $dir = Split-Path $targetPath
    if (!(Test-Path $dir)) { 
        New-Item -ItemType Directory -Path $dir -Force | Out-Null 
    }
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($sourceImage, 0, 0, $width, $height)
    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
}

# Web Assets
Resize-Image $img 512 512 "E:\expense arranger\public\logo.png"
Resize-Image $img 64 64 "E:\expense arranger\public\favicon.png"

# Android Mipmap Icons
$sizes = @{
    "mdpi" = @{ launcher = 48; fg = 108 }
    "hdpi" = @{ launcher = 72; fg = 162 }
    "xhdpi" = @{ launcher = 96; fg = 216 }
    "xxhdpi" = @{ launcher = 144; fg = 324 }
    "xxxhdpi" = @{ launcher = 192; fg = 432 }
}

foreach ($density in $sizes.Keys) {
    $lSize = $sizes[$density].launcher
    $fgSize = $sizes[$density].fg
    $resDir = "E:\expense arranger\android\app\src\main\res\mipmap-$density"
    
    Resize-Image $img $lSize $lSize "$resDir\ic_launcher.png"
    Resize-Image $img $lSize $lSize "$resDir\ic_launcher_round.png"
    Resize-Image $img $fgSize $fgSize "$resDir\ic_launcher_foreground.png"
}

$img.Dispose()
Write-Output "Images generated successfully!"
