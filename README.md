# GPK RC
![GPK RC](https://github.com/darakuneko/gpk_rc/raw/main/img/gpkrc.png)
## QMK Remote Controller Application

- Automatic layer switching
- Write time to OLED
- This Applcation use custom [qmk_rc](https://github.com/mmalecki/qmk_rc)
- [custom qmk_rc&via](https://github.com/darakuneko/keyboard/tree/main/qmk/custom_qmkrc) QMK compatible
  version is 0.13.15

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
download: [custom qmk_rc&via](https://github.com/darakuneko/keyboard/tree/main/qmk/custom_qmkrc)

#### qmk/quantum/

copy&replace qmk_rc.h,via.c,via.h

#### qmk/keyboards/"my keyboard"

copy qmk_rc.c

#### rule.mk

```SRC += qmk_rc.c```

```VIA_ENABLE = yes```

  
## License

MIT
