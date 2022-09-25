# GPK RC
[![Hot to GPK RC](https://github.com/darakuneko/gpk_rc/raw/main/img/how_to_use_gpk_rc.gif)](https://youtu.be/g3gRi1g3p_s)
[![](https://img.youtube.com/vi/d3974UKRs38/0.jpg)](https://www.youtube.com/watch?v=d3974UKRs38)

## QMK Remote Controller Application

- Automatic layer switching
- Change layers per OS
- Change layers per Applcation
- Write time to OLED (write to the last line)
- This Applcation use custom [qmk_rc](https://github.com/mmalecki/qmk_rc)
- [custom qmk_rc&via](https://github.com/darakuneko/keyboard/tree/main/qmk/custom_qmkrc) QMK compatible
  version is 0.14.32, 0.16.9, 0.17.0, 0.18.6
- It might work, but I won't guarantee it in other versions.
- Support VIA/Remap

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
- GPK60 Series
- Yamada Series
- Num-Num Strawberry!!

### Apply to my keyboard

download: [custom qmk_rc&via](https://github.com/darakuneko/keyboard/raw/main/qmk/custom_qmkrc.zip)

#### If QMK clone

```
git clone https://github.com/qmk/qmk_firmware.git -b 0.14.32
cd qmk_firmware
make git-submodule
```

#### qmk_firmware/quantum/

copy&replace qmk_rc.h,via.c,via.h

#### qmk_firmware/keyboards/"my keyboard"

copy qmk_rc.c

#### rules.mk

```SRC += qmk_rc.c```

```VIA_ENABLE = yes```

  
## License

MIT
