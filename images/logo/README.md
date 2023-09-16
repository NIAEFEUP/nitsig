To convert the logo.png to 128, 64, 48, 32 and 16 sizes, run the following command:

```
convert logo.png -resize 128x128 -gravity center -background transparent -extent 128x128 logo-128.png
convert logo.png -resize 64x64 -gravity center -background transparent -extent 64x64 logo-64.png
convert logo.png -resize 48x48 -gravity center -background transparent -extent 48x48 logo-48.png
convert logo.png -resize 32x32 -gravity center -background transparent -extent 32x32 logo-32.png
convert logo.png -resize 16x16 -gravity center -background transparent -extent 16x16 logo-16.png
```
