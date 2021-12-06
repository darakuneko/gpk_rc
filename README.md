# GPK RC

## QMK Remote Controller Application

- Automatic layer switching
- Write time to OLED
- This Applcation use custom [qmk_rc](https://github.com/mmalecki/qmk_rc)
- [custom quantum/via](https://github.com/darakuneko/keyboard/tree/main/qmk/num_num_strawberry/quantum) QMK compatible
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

## License

MIT