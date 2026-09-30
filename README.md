# `MetaGymLand App`

MetaGymLand Wellness Metaverse Powered with AI

https://metagymland.com/

## License and Rights

Copyright (c) 2026 Marcin Kużdowicz.
All rights reserved.

This repository is public for visibility only.
No permission is granted to use, copy, modify, merge, publish, distribute,
sublicense, and/or sell this software without prior written permission.

### This repo has the main frontend logic of MetaGymLand App for:

- AI for pose detection via Webcam
- Metaverse and MiniGames code
- Stretch to earn very basic logic

`earning XP points is currently off chain`

## Other MetaGymLand code repositories

### NFT and Marketpalce Smart Contracts (deprecated)

in separate repo:

https://github.com/coderdidit/meta-gym-land-contracts

### MetaGymLand landing page

in separate repo:

https://github.com/coderdidit/meta-gym-land-landing-page

### MetaGymLand NFT utils (deprecated)

in separate repo:

https://github.com/coderdidit/meta-gym-land-nft-utils

### Technologies used:

- Tensorflow and MediaPipe for pose detection
- Phaser game engine
- React
- TypeScript

## Running locally

Use Node.js 24 LTS (Node.js 22.12+ is also supported).

```
yarn install
yarn start
```

## Tests

```sh
yarn test        # Run the unit tests once, including in CI
yarn test:watch  # Rerun tests as files change
```

Tests use Vitest and share the Vite configuration and import aliases. The current
unit tests run in Node; desktop gameplay and webcam checks are performed manually.
