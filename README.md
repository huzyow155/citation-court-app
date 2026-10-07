# Citation Court dApp

Citation Court checks whether the webpage behind a link contains normalized textual evidence supporting or contradicting a single-fact claim.

Independent GenLayer validators fetch the cited URL and evaluate the claim under the Equivalence Principle. The contract stores only the resulting verdict (`SUPPORTS`, `CONTRADICTS`, `NOT_ADDRESSED`, or `UNREADABLE`). It does not assert whether the cited source is trustworthy or whether the claim is objectively true in the real world.

## Status & Network
- **Status**: Preview
- **Network**: GenLayer Studionet
- **Chain ID**: `61999`
- **RPC Endpoint**: `https://studio.genlayer.com/api`
- **Contract Address**: `0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5`
- **Contract Source Repository**: [citation-court-genlayer](https://github.com/huzyow155/citation-court-genlayer)
- **Explorer**: [Citation Court Contract on Studionet Explorer](https://explorer-studio.genlayer.com/address/0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5)

## Architecture & Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Web3 SDK**: `genlayer-js@1.1.8`
- **Design System**: Hand-crafted proofreading layout using plain CSS custom properties
- **Fonts**: `@fontsource/newsreader`, `@fontsource/plus-jakarta-sans`, `@fontsource/ibm-plex-mono`
- **Test Runner**: Vitest

## License
MIT (see [LICENSE](./LICENSE))
