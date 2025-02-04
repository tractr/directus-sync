# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.2.2](https://github.com/tractr/directus-sync/compare/directus-sync@3.2.1...directus-sync@3.2.2) (2025-02-04)


### Bug Fixes

* **cli:** handle policy.roles addition and removal on push ([#150](https://github.com/tractr/directus-sync/issues/150)) ([a214305](https://github.com/tractr/directus-sync/commit/a214305de4042d81790a2566a81685e534214ceb))





## [3.2.1](https://github.com/tractr/directus-sync/compare/directus-sync@3.2.0...directus-sync@3.2.1) (2025-02-04)


### Bug Fixes

* do not remove users policies relations on update ([#149](https://github.com/tractr/directus-sync/issues/149)) ([f614947](https://github.com/tractr/directus-sync/commit/f614947ebed7ea5a0b561a15e2b285b9d6ece4ed))





# [3.2.0](https://github.com/tractr/directus-sync/compare/directus-sync@3.1.6...directus-sync@3.2.0) (2025-01-25)


### Features

* add seed commands and improve logging ([#146](https://github.com/tractr/directus-sync/issues/146)) ([cbc8835](https://github.com/tractr/directus-sync/commit/cbc883573aef1df9880d0e2e5278ec7f971163e7)), closes [#142](https://github.com/tractr/directus-sync/issues/142) [#144](https://github.com/tractr/directus-sync/issues/144) [#145](https://github.com/tractr/directus-sync/issues/145)





## [3.1.6](https://github.com/tractr/directus-sync/compare/directus-sync@3.1.5...directus-sync@3.1.6) (2024-11-28)


### Bug Fixes

* **cli:** handles fields and collections naming conflicts in snapshot files ([#119](https://github.com/tractr/directus-sync/issues/119)) ([#120](https://github.com/tractr/directus-sync/issues/120)) ([955233a](https://github.com/tractr/directus-sync/commit/955233a6336e4a8370cd8b1eae47967b14ce5a42))





## [3.1.5](https://github.com/tractr/directus-sync/compare/directus-sync@3.1.4...directus-sync@3.1.5) (2024-10-24)


### Bug Fixes

* **cli:** handle RECORD_NOT_UNIQUE response on creation ([#112](https://github.com/tractr/directus-sync/issues/112)) ([aa48bbf](https://github.com/tractr/directus-sync/commit/aa48bbf59cf81bead43e2308e7d291c02338dca0))





## [3.1.4](https://github.com/tractr/directus-sync/compare/directus-sync@3.1.3...directus-sync@3.1.4) (2024-10-17)


### Bug Fixes

* **cli:** allow sort to be null ([#109](https://github.com/tractr/directus-sync/issues/109)) ([471896f](https://github.com/tractr/directus-sync/commit/471896fd3e73639c1f9432ace4b7fb46dc89412b))





## [3.1.3](https://github.com/tractr/directus-sync/compare/directus-sync@3.1.2...directus-sync@3.1.3) (2024-09-22)


### Bug Fixes

* **cli:** map id of settings.storage_default_folder ([#104](https://github.com/tractr/directus-sync/issues/104)) ([bc060b1](https://github.com/tractr/directus-sync/commit/bc060b154d7405fc00bfadd6bd42eff905b7c5dd))





## [3.1.2](https://github.com/tractr/directus-sync/compare/directus-sync@3.1.0...directus-sync@3.1.2) (2024-09-13)

**Note:** Version bump only for package directus-sync





# [3.1.0](https://github.com/tractr/directus-sync/compare/directus-sync@3.0.0...directus-sync@3.1.0) (2024-09-13)


### Features

* **cli:** check directus-extension-sync is installed before push ([#97](https://github.com/tractr/directus-sync/issues/97)) ([f78fac7](https://github.com/tractr/directus-sync/commit/f78fac7b67468c4ccf144f8ad5f71bf8183c38aa))
* **cli:** log config file loading status ([#95](https://github.com/tractr/directus-sync/issues/95)) ([97f4b15](https://github.com/tractr/directus-sync/commit/97f4b15fbd5be23a2b8c6bc772d0800abce07f1a))





# [3.0.0](https://github.com/tractr/directus-sync/compare/directus-sync@2.2.0...directus-sync@3.0.0) (2024-09-05)


### Features

* supports for Directus 11 ([#94](https://github.com/tractr/directus-sync/issues/94)) ([2aaea4f](https://github.com/tractr/directus-sync/commit/2aaea4ff54f7006ea4a0f3271786019370188c41))


### BREAKING CHANGES

* Does not support Directus 10.x versions. Permissions have changed





# [2.2.0](https://github.com/tractr/directus-sync/compare/directus-sync@2.1.0...directus-sync@2.2.0) (2024-07-15)


### Features

* allow Directus client config ([#86](https://github.com/tractr/directus-sync/issues/86)) ([02f053f](https://github.com/tractr/directus-sync/commit/02f053febab9d0b7f42cbe1bd9b8301af2809e1c))





# [2.1.0](https://github.com/tractr/directus-sync/compare/directus-sync@2.0.0...directus-sync@2.1.0) (2024-05-25)


### Bug Fixes

* **cli:** remove short options for helpers that may conflict ([9d85eeb](https://github.com/tractr/directus-sync/commit/9d85eeb5208db96fd6ece0072380ef25b11e569b))


### Features

* **cli:** add option to preserve ids on specific collections ([#74](https://github.com/tractr/directus-sync/issues/74)) ([4f7541e](https://github.com/tractr/directus-sync/commit/4f7541e7c976b18dc57a1daa7e028f75606cf586))





# [2.0.0](https://github.com/tractr/directus-sync/compare/directus-sync@1.5.3...directus-sync@2.0.0) (2024-05-23)


* feat!: compatibility with directus 10.11.x (#72) ([59e78a8](https://github.com/tractr/directus-sync/commit/59e78a8cb1023a8974960ae1953ee4a0f78f13ce)), closes [#72](https://github.com/tractr/directus-sync/issues/72)


### BREAKING CHANGES

* Webhooks are no longer supported by Directus and Directus-Sync

* chore(e2e): run format

* test(e2e): fix tests

* test(e2e): fix tests

* test(e2e): update dumps for 10.10.7

* test(e2e): adapt tests for 10.10.7

add report_error_url, report_bug_url and report_feature_url

* feat(e2e): upgrade to 10.11.1

* feat(e2e): upgrade to 10.11.1

* feat(e2e): add upgrade script

* feat(cli): handle new settings fields

* chore: run format

* chore: update dependencies

* docs: update compatibility flag

* fix(cli): force allow any for schema





## [1.5.3](https://github.com/tractr/directus-sync/compare/directus-sync@1.5.2...directus-sync@1.5.3) (2024-05-08)


### Bug Fixes

* **cli:** avoid conflicts during operations creations ([#66](https://github.com/tractr/directus-sync/issues/66)) ([b678d3a](https://github.com/tractr/directus-sync/commit/b678d3a151c2ef80d521df22a8e7e55d6ac2595a))





## [1.5.2](https://github.com/tractr/directus-sync/compare/directus-sync@1.5.1...directus-sync@1.5.2) (2024-05-02)


### Bug Fixes

* **cli:** add missing dep pino-pretty ([d136367](https://github.com/tractr/directus-sync/commit/d13636758c3653afbb66c6a1ac6ce280729e67ea))





## [1.5.1](https://github.com/tractr/directus-sync/compare/directus-sync@1.5.0...directus-sync@1.5.1) (2024-05-02)


### Bug Fixes

* add safe logger in entrypoint ([3f73594](https://github.com/tractr/directus-sync/commit/3f735949a8997916bef95fc4938f3356371ad42c))





# [1.5.0](https://github.com/tractr/directus-sync/compare/directus-sync@1.4.0...directus-sync@1.5.0) (2024-05-02)


### Bug Fixes

* **cli:** handle "record not unique" errors on operations ([#60](https://github.com/tractr/directus-sync/issues/60)) ([b1c8f0b](https://github.com/tractr/directus-sync/commit/b1c8f0b249373a0bd6637d7bb1935df20bf4a340))
* permission duplicates ([#62](https://github.com/tractr/directus-sync/issues/62)) ([5f0a105](https://github.com/tractr/directus-sync/commit/5f0a10507563493347ff9230f505a205cb652dc5))


### Features

* **cli:** add excludeCollections and onlyCollections options ([#52](https://github.com/tractr/directus-sync/issues/52)) ([e5e0451](https://github.com/tractr/directus-sync/commit/e5e0451950b2e892d918442b28fa147bb0daa09d))
* **cli:** add hooks for snapshot ([#56](https://github.com/tractr/directus-sync/issues/56)) ([51a28bb](https://github.com/tractr/directus-sync/commit/51a28bba0abb145c494998282b804c4aba369e63))
* **cli:** add option to ignore snapshot ([#54](https://github.com/tractr/directus-sync/issues/54)) ([a32b294](https://github.com/tractr/directus-sync/commit/a32b294d96325beb30bd73051c789513966a67a8))





# [1.4.0](https://github.com/tractr/directus-sync/compare/directus-sync@1.3.0...directus-sync@1.4.0) (2024-03-25)


### Bug Fixes

* empty permissions since 10.10.x ([#39](https://github.com/tractr/directus-sync/issues/39)) ([9e61d26](https://github.com/tractr/directus-sync/commit/9e61d26184aee5d4f42ca7787a42197450771538))


### Features

* clear cache before process ([#40](https://github.com/tractr/directus-sync/issues/40)) ([d72502d](https://github.com/tractr/directus-sync/commit/d72502d1b1a8429ce464e5224ba79d6ff2bfcf3c))





# [1.3.0](https://github.com/tractr/directus-sync/compare/directus-sync@1.1.0...directus-sync@1.3.0) (2024-03-12)

### Features

- pull OpenAPI & GraphQL specifications ([#35](https://github.com/tractr/directus-sync/issues/35)) ([5d41d07](https://github.com/tractr/directus-sync/commit/5d41d07a67677f05aadf5a0b6bb22e76fd00f474))

# [1.2.0](https://github.com/tractr/directus-sync/compare/directus-sync@1.1.0...directus-sync@1.2.0) (2024-03-12)

### Features

- pull OpenAPI & GraphQL specifications ([#35](https://github.com/tractr/directus-sync/issues/35)) ([5d41d07](https://github.com/tractr/directus-sync/commit/5d41d07a67677f05aadf5a0b6bb22e76fd00f474))

# [1.1.0](https://github.com/tractr/directus-sync/compare/directus-sync@0.6.0...directus-sync@1.1.0) (2024-03-04)

### Features

- add presets sync support ([#32](https://github.com/tractr/directus-sync/issues/32)) ([451f711](https://github.com/tractr/directus-sync/commit/451f711a610a0bebc1bb1e2e05da9bcb1151f5c3))
- better logging for diff issues ([#34](https://github.com/tractr/directus-sync/issues/34)) ([06c547d](https://github.com/tractr/directus-sync/commit/06c547d874c484b6358444b0d67010b9f50f8675))

# [1.0.0](https://github.com/tractr/directus-sync/compare/directus-sync@0.6.0...directus-sync@1.0.0) (2024-02-26)

### Features

- add presets sync support ([#32](https://github.com/tractr/directus-sync/issues/32)) ([451f711](https://github.com/tractr/directus-sync/commit/451f711a610a0bebc1bb1e2e05da9bcb1151f5c3))

# [0.6.0](https://github.com/tractr/directus-sync/compare/directus-sync@0.5.0...directus-sync@0.6.0) (2024-01-31)

### Features

- handle folders collection ([#29](https://github.com/tractr/directus-sync/issues/29)) ([b9ba5fb](https://github.com/tractr/directus-sync/commit/b9ba5fb9c7fca35bfd0a0ccba68fb001f22c36ce)), closes [#27](https://github.com/tractr/directus-sync/issues/27) [#28](https://github.com/tractr/directus-sync/issues/28)

# 0.5.0 (2024-01-24)

### Features

- handle more config file paths ([#24](https://github.com/tractr/directus-sync/issues/24)) ([cad3398](https://github.com/tractr/directus-sync/commit/cad3398486c93d99fc49057920d0a42da6dc2d9f))

# [0.4.0](https://github.com/tractr/directus-sync/compare/directus-sync@0.3.1...directus-sync@0.4.0) (2024-01-23)

### Features

- preserve flows ids, add hooks and handle translations collection ([#23](https://github.com/tractr/directus-sync/issues/23)) ([0b3faf9](https://github.com/tractr/directus-sync/commit/0b3faf963cc1fb7ec7abbb5d62500de77cc47059)), closes [#13](https://github.com/tractr/directus-sync/issues/13) [#20](https://github.com/tractr/directus-sync/issues/20) [#14](https://github.com/tractr/directus-sync/issues/14) [#13](https://github.com/tractr/directus-sync/issues/13) [#18](https://github.com/tractr/directus-sync/issues/18)

## 0.3.1 (2024-01-16)

**Note:** Version bump only for package directus-sync

# 0.3.0 (2023-11-30)

### Features

- configuration improvement ([#14](https://github.com/tractr/directus-sync/issues/14)) ([5c1ec08](https://github.com/tractr/directus-sync/commit/5c1ec0824da689774463cf0b24ca40245c4e072a)), closes [#13](https://github.com/tractr/directus-sync/issues/13)

# 0.2.0 (2023-11-21)

### Features

- **cli:** ignore assets & url fields from settings ([#11](https://github.com/tractr/directus-sync/issues/11)) ([bc0853a](https://github.com/tractr/directus-sync/commit/bc0853af946818e0edf789611c7fba9c5a8183fe))

## 0.1.15 (2023-11-20)

### Bug Fixes

- allow recursive data mapping ([#10](https://github.com/tractr/directus-sync/issues/10)) ([6b9649e](https://github.com/tractr/directus-sync/commit/6b9649e430170de7b4f7754ff747f6a6d47ac9fb))

## 0.1.14 (2023-11-20)

**Note:** Version bump only for package directus-sync

## 0.1.13 (2023-11-20)

**Note:** Version bump only for package directus-sync

## 0.1.12 (2023-11-20)

**Note:** Version bump only for package directus-sync

## 0.1.11 (2023-11-20)

**Note:** Version bump only for package directus-sync

## 0.1.10 (2023-11-20)

**Note:** Version bump only for package directus-sync

## 0.1.9 (2023-11-20)

**Note:** Version bump only for package directus-sync

## 0.1.8 (2023-11-20)

**Note:** Version bump only for package directus-sync
