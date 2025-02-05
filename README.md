# GPK RC

https://github.com/user-attachments/assets/3db39783-3c90-4811-838a-5d6c36993ae7

After selecting the application you want to use, GPK RC selection list will display the application names (up to the latest 10).    

[![](https://img.youtube.com/vi/d3974UKRs38/0.jpg)](https://www.youtube.com/watch?v=d3974UKRs38)

You can set it to use different layers for each application.

## QMK Remote Controller Application

- Automatic layer switching based on application or OS
- Write time to OLED (write to the last line)
- Support Vial

## Build

windows

```sh
 yarn dist:win
```

mac

```sh
 yarn dist:mac
```

linux

```sh
yarn dist:linux
```

### Use Vial
https://github.com/darakuneko/vial-qmk/tree/gpk_rc    
use gpk_rc branch   

rules.mk  
```GPKRC_ENABLE = yes```

## License

MIT
