# GPK RC
[![Hot to GPK RC](https://github.com/darakuneko/gpk_rc/raw/main/img/how_to_use_gpk_rc.gif)](https://youtu.be/g3gRi1g3p_s)

## QMK Remote Controller Application

- Automatic layer switching
- Write time to OLED
- This Applcation use custom [qmk_rc](https://github.com/mmalecki/qmk_rc)
- [custom qmk_rc&via](https://github.com/darakuneko/keyboard/tree/main/qmk/custom_qmkrc) QMK compatible
  version is 0.13, 0.14.0 to 0.14.32
- Do not use above 0.14.33  

## Build

windows

```sh
 npm run dist:win --openssl_fips=X
```

mac

```sh
 npm run dist:mac --openssl_fips=X
```

linux

```sh
 npm run dist:linux
```

## Keybaord Side

### Compatible models
- GPK60-33R
- GPK60-45C
- GKP60-46A
- GKP60-46SGR
- GKP60-46W
- GKP60-47GR1RE
- GPK60-51O
- GPK60-51R
- GPK60-55O
- GPK60-60R
- GPK60-65O
- Num-Num Strawberry!!
- Yamada75 Go

### Apply to my keyboard

download: [custom qmk_rc&via](https://github.com/darakuneko/keyboard/raw/main/qmk/custom_qmkrc.zip)

#### If QMK clone

```
git clone https://github.com/qmk/qmk_firmware.git -b 0.14.32
cd qmk_firmware
make git-submodule
```

#### qmk/quantum/

copy&replace qmk_rc.h,via.c,via.h

#### qmk/keyboards/"my keyboard"

copy qmk_rc.c

#### rule.mk

```SRC += qmk_rc.c```

```VIA_ENABLE = yes```

  
## License

MIT
