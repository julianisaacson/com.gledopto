# Zigbee Power Meters & Switches for Homey

Homey app for controlling and monitoring specific Zigbee power meters and switches.

## Develop this Homey app locally

### 1) Install prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- Homey CLI:
  ```bash
  npm install -g homey
  ```
- A Homey Pro on the same network, signed in with your Athom account.

### 2) Install dependencies
```bash
npm install
```

### 3) Validate the app
```bash
homey app validate
```

### 4) Run the app on Homey in debug mode
```bash
homey app run
```

### 5) Package the app (optional)
```bash
homey app build
```

## Supported devices
- Tongou MCB (`TS0001`)
  - Manufacturer IDs: `_TZE284_kobbcyum`, `_TZE284_tzreobvu`
  - Capabilities: on/off, power, voltage, current, kWh
- Power Meter with Display (`TS0601`)
  - Manufacturer ID: `_TZE200_rhblgy0z`
  - Capabilities: on/off, power, voltage, current, kWh

## Project structure
- `app.js` – app entrypoint.
- `drivers/` – generic driver logic.
- `gl-*/` folders – existing device-specific driver implementations.
- `lib/` – Zigbee cluster helper code.
- `locales/` – translations.

## Tips for extending this app
1. Add or update drivers for the targeted power meters and switches.
2. Implement/extend the corresponding `device.js` logic for measurement and switching behavior.
3. Add translations in `locales/en.json` and other locale files.
4. Re-run `homey app validate` and `homey app run` to test.

## Useful Homey docs
- Homey Apps SDK v3: https://apps.developer.homey.app/
- CLI commands: https://apps.developer.homey.app/the-basics/tools/cli
- Zigbee support: https://apps.developer.homey.app/wireless/zigbee
