## [1.4.0](https://github.com/haandsolutions/haand-bib/compare/v1.3.0...v1.4.0) (2022-06-27)


### :sparkles: New Features

* **pagination:** update pagination service ([8aa4e36](https://github.com/haandsolutions/haand-bib/commit/8aa4e36367b5215d41d07d48551a0bf7ee95aac0))


### :white_check_mark: Tests

* **associated:** add pagination to associated module ([bee2740](https://github.com/haandsolutions/haand-bib/commit/bee27408dbd3700f745b5dd2b2cda2ab48b9401d)), closes [#82](https://github.com/haandsolutions/haand-bib/issues/82)
* **pagination:** create pagination unit tests ([88a9ec0](https://github.com/haandsolutions/haand-bib/commit/88a9ec09bde151b47867495fc199846d6205c1a2))
* **associated:** update associated functional test ([f9448a8](https://github.com/haandsolutions/haand-bib/commit/f9448a812a80dcf73703a3cceca02c2ded797616)), closes [#83](https://github.com/haandsolutions/haand-bib/issues/83)
* **benefit:** update benefit functional tests ([42ca05c](https://github.com/haandsolutions/haand-bib/commit/42ca05ce17eca2b70faf57e2d999cb6026c22079)), closes [#83](https://github.com/haandsolutions/haand-bib/issues/83)

## [1.3.0](https://github.com/haandsolutions/haand-bib/compare/v1.2.0...v1.3.0) (2022-06-27)


### :sparkles: New Features

* **consultant:** add query params to associated module ([e5667aa](https://github.com/haandsolutions/haand-bib/commit/e5667aa9d42f01a65d6c5a4f213af4bebda8b234)), closes [#93](https://github.com/haandsolutions/haand-bib/issues/93)
* **benefit:** add query params to benefit ([4475914](https://github.com/haandsolutions/haand-bib/commit/4475914b4fc383968c6ecd38e2df9d19589ad96f)), closes [#93](https://github.com/haandsolutions/haand-bib/issues/93)
* **beneft:** create benefit module ([031c423](https://github.com/haandsolutions/haand-bib/commit/031c4233526091d2123612f24d0d8ea7478141c0)), closes [#93](https://github.com/haandsolutions/haand-bib/issues/93)


### :bug: Fixes

* adjust the schema of association module ([7966520](https://github.com/haandsolutions/haand-bib/commit/7966520f0c921a8b25c19d13c040701b7815d8f4))


### :white_check_mark: Tests

* adjust the unit tests of benefit module ([bbbaf22](https://github.com/haandsolutions/haand-bib/commit/bbbaf220b9821eedf88fae88c0332128a98a1715))
* **associated:** update associated functional tests ([01764f0](https://github.com/haandsolutions/haand-bib/commit/01764f09500b29f848b02810e9cc5b4e1b8450a2)), closes [#83](https://github.com/haandsolutions/haand-bib/issues/83)
* **benefit:** update functional tests ([dda67c4](https://github.com/haandsolutions/haand-bib/commit/dda67c4c19ef352e8d3bda798fb8636924902644)), closes [#83](https://github.com/haandsolutions/haand-bib/issues/83)


### :zap: Refactor

* add auth to benefit module ([d1faafb](https://github.com/haandsolutions/haand-bib/commit/d1faafbb4b7c594c2437e24c2153cfa1e80af2b0))
* **general:** update cellPhone spelling ([f8c38cf](https://github.com/haandsolutions/haand-bib/commit/f8c38cfdfc5b6f8fe623e67d45e64d7883b03524)), closes [#83](https://github.com/haandsolutions/haand-bib/issues/83)
* **database:** update prisma singleton ([0ccf173](https://github.com/haandsolutions/haand-bib/commit/0ccf17315641fac1c35826339d31f1161dad0247)), closes [#83](https://github.com/haandsolutions/haand-bib/issues/83)


### :repeat: CI

* add develop to trigger the pipeline ([2c4268c](https://github.com/haandsolutions/haand-bib/commit/2c4268c57e34234838e2962d345294f411d2e7e4))

## [1.2.0](https://github.com/haandsolutions/haand-bib/compare/v1.1.0...v1.2.0) (2022-06-01)


### :repeat: CI

* update docker-compose env ([805b7ff](https://github.com/haandsolutions/haand-bib/commit/805b7ffbef25467bb1a1f324c2e9537b9c94d901))


### :sparkles: New Features

* add users seeders to populate database in application startup ([39cca21](https://github.com/haandsolutions/haand-bib/commit/39cca21a1aec6c5b7f3be0ef28ed16b802482365))
* **associated:** create associated use case ([311c99f](https://github.com/haandsolutions/haand-bib/commit/311c99f7a51a5516ba732841b2ad68d7abd17c35)), closes [#77](https://github.com/haandsolutions/haand-bib/issues/77)


### :bug: Fixes

* add the field createby in create association route ([1b5ba3c](https://github.com/haandsolutions/haand-bib/commit/1b5ba3c512afb832f8c00acc0ae4a5e2f18fd39e))


### :memo: Documentation

* add unauthorized response details in routes of the modules ([11a3aa4](https://github.com/haandsolutions/haand-bib/commit/11a3aa44ee254da553c3bad315d2e69916dfd7fe))
* adjust the swagger docs of loan simulation module ([38b4371](https://github.com/haandsolutions/haand-bib/commit/38b4371112aaad5a241ae123be6c1ccedc8a64eb))


### :zap: Refactor

* add authentication to associated module ([9c549b1](https://github.com/haandsolutions/haand-bib/commit/9c549b135ae80426ce4f2e432b4371a32d315a67))
* adjust the auth middleware error returns ([b66de0b](https://github.com/haandsolutions/haand-bib/commit/b66de0bc633b5068c4fa66302c1e54fd787d0b44))
* adjust the name of interface ([d03f7f9](https://github.com/haandsolutions/haand-bib/commit/d03f7f9c62eef07d82e83529882f2e8e8e93620d))
* adjust the name of the interface ([263961e](https://github.com/haandsolutions/haand-bib/commit/263961e7e20c4830d325293bccf10c631f8e131f))
* change the name of the module of auth ([a9e8ca1](https://github.com/haandsolutions/haand-bib/commit/a9e8ca1ba5412d8483cd5710a58f206c015dfa8b))


### :white_check_mark: Tests

* adjust the error response factories ([2531ab4](https://github.com/haandsolutions/haand-bib/commit/2531ab4f70b660b50b5568a4dda4bdd4e2630687))
* adjust the imports of tests ([91cb85a](https://github.com/haandsolutions/haand-bib/commit/91cb85a5bc82f2d2936fbb739bbd223d010a462b))
* adjust the imports of tests ([07f4191](https://github.com/haandsolutions/haand-bib/commit/07f419102382e7e8a666041dfd486b17bdd7c061))
* adjust the imports of tests ([40a1e37](https://github.com/haandsolutions/haand-bib/commit/40a1e37115d7ce663d1035ea71746a009dab1d77))
* adjust the jest config to ignore seeders in coverage ([b62319a](https://github.com/haandsolutions/haand-bib/commit/b62319af05b9a3ae093621fca15f7b4a99ad24f3))
* adjust the jest threshould ([24abaf1](https://github.com/haandsolutions/haand-bib/commit/24abaf1d14da81e695f795cd2ce1da92308c103c))
* adjust the name of the interfaces ([d2542e2](https://github.com/haandsolutions/haand-bib/commit/d2542e24cb9f4da85d4d8df3cc344bbfa5265ba6))
* adjust the tests of auth middleware ([e7575c7](https://github.com/haandsolutions/haand-bib/commit/e7575c7b2599747805ee33f85ea9775c650ed509))
* adjust the tests of authmiddleware ([273a409](https://github.com/haandsolutions/haand-bib/commit/273a409b49805d784e6ec81005ea9b4f8596cffa))
* adjust the tests of error middleware ([39e7352](https://github.com/haandsolutions/haand-bib/commit/39e7352393b55fe087e082cc6d7371475c5f06b9))
* adjust the tests to run with auth ([c3cb65c](https://github.com/haandsolutions/haand-bib/commit/c3cb65c2ebe45d9f2e88bc6eaf948a651ec7f350))
* adjust the unit tests of associated module ([57cee40](https://github.com/haandsolutions/haand-bib/commit/57cee40d90d0aa99fa32d588ec73bb96e4d6d91f))

## [1.1.0](https://github.com/haandsolutions/haand-bib/compare/v1.0.1...v1.1.0) (2022-05-18)


### :repeat: CI

* **ci:** update ci env ([415951b](https://github.com/haandsolutions/haand-bib/commit/415951bf02e13da8b0b283dc3cbb0711f222292b)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)


### :white_check_mark: Tests

* add definition of app in a global variable ([83b25bb](https://github.com/haandsolutions/haand-bib/commit/83b25bb63a08c21ec5f26d17ebe7ff33bb6ba43c))
* add factory of unauthorized error ([185b54b](https://github.com/haandsolutions/haand-bib/commit/185b54b1b7d0d4a5b51af309ee2c07fc2de36ecb))
* add integration tests to auth middleware ([2c860e7](https://github.com/haandsolutions/haand-bib/commit/2c860e78992f859b248737c9bcc779054827a4b8))
* add integration tests to global error middleware ([88a8900](https://github.com/haandsolutions/haand-bib/commit/88a8900c1d383dd9472a31da07693d04de24d895))
* adjust the functional tests of loan simulation module ([556c06c](https://github.com/haandsolutions/haand-bib/commit/556c06cf3e43cab83c2a3f564842be81f0724bd3))
* adjust the unit tests of auth service ([6990aba](https://github.com/haandsolutions/haand-bib/commit/6990abab7a7849554ed98baca5632395a333f0f0))
* adjust unit tests of auth service ([cde82e4](https://github.com/haandsolutions/haand-bib/commit/cde82e41a1d0bf742cdbc5773b241ff8b217eff0))
* **tests:** improve test coverage ([4a7b1eb](https://github.com/haandsolutions/haand-bib/commit/4a7b1eb80bea3d1664ebe6c452d78ac142bb5fef)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **user:** remove getById from user service ([09d359d](https://github.com/haandsolutions/haand-bib/commit/09d359d270156d9756999c841ef2ffcc83e73933)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **test:** update functional tests ([daf7f33](https://github.com/haandsolutions/haand-bib/commit/daf7f33bb15899620a5af0e1980d9894d83bf738)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)


### :sparkles: New Features

* add authentication to loan simulation routes ([612de18](https://github.com/haandsolutions/haand-bib/commit/612de18ff6fc1a1bd23dcf9314fbbdedd56b0737))
* **auth:** change login from email to username ([124525e](https://github.com/haandsolutions/haand-bib/commit/124525e1f0d4145b44c4e2efe8ecac29bebbc944)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **auth:** create auth story ([54cd6f8](https://github.com/haandsolutions/haand-bib/commit/54cd6f82ae89799f4ef18c7fd9051f82c346a28d)), closes [#42](https://github.com/haandsolutions/haand-bib/issues/42)
* **user:** create enum for role and status ([2ff9a8e](https://github.com/haandsolutions/haand-bib/commit/2ff9a8e6bb105b023b4d808f2731fc0841e96439)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **auth:** create me route ([02c2d92](https://github.com/haandsolutions/haand-bib/commit/02c2d92ba2c4b6e535f4c0383fab9c6202d10b1b)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **user:** create user stories ([e6bfd84](https://github.com/haandsolutions/haand-bib/commit/e6bfd84572838170732841fcf3f9a8e656f8ce52)), closes [#40](https://github.com/haandsolutions/haand-bib/issues/40)
* **auth:** make login return complete user data instead name ([e219684](https://github.com/haandsolutions/haand-bib/commit/e219684503dbea6266f2af0816e291c5ac8f2119)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **user:** pass user info to request ([c06da51](https://github.com/haandsolutions/haand-bib/commit/c06da5134277676106520a90eb16ac7f36030cec)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **user:** remove password from user response ([4f96f4c](https://github.com/haandsolutions/haand-bib/commit/4f96f4c2576a41c0535ba7807a5d6fbd55d5adaf)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)


### :zap: Refactor

* adjust the auth service interfaces ([86eadc5](https://github.com/haandsolutions/haand-bib/commit/86eadc5dba86c0484f8f187f6dc2dfda77b9b836))
* adjust the exports of unautorized error ([27b76f7](https://github.com/haandsolutions/haand-bib/commit/27b76f7439f0fe7fa80adeb8f6d09466e4213370))
* adjust the types of auth middleware parameters ([d6bed92](https://github.com/haandsolutions/haand-bib/commit/d6bed923da2aace5f92870f5f7d0d0d6a9b2a78a))
* **test:** create login helper to generate token before tests ([bacdfb1](https://github.com/haandsolutions/haand-bib/commit/bacdfb1a0589434e43591584c33eca6dff65e855)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **auth:** update auth error messages ([8803ff8](https://github.com/haandsolutions/haand-bib/commit/8803ff848da97cb04d6232a45e583b5b8e91affc)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **auth:** update auth naming and routes ([c596ed0](https://github.com/haandsolutions/haand-bib/commit/c596ed0969c752f1a8e42acf36ad3d7a1e3f075e)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)
* **user:** update tests ([2d7f8cf](https://github.com/haandsolutions/haand-bib/commit/2d7f8cfc56519cf0c2c3e8b4e0f810d19754ff82)), closes [#45](https://github.com/haandsolutions/haand-bib/issues/45)

### [1.0.1](https://github.com/haandsolutions/haand-bib/compare/v1.0.0...v1.0.1) (2022-04-22)


### :bug: Fixes

* adjust the validation to expose swagger docs ([57e4da5](https://github.com/haandsolutions/haand-bib/commit/57e4da5a71fba3c4d7d248118d1afb4b9ef089e3))


### :repeat: CI

* adjust the labels of job in github actions workflow config ([a6c1f0c](https://github.com/haandsolutions/haand-bib/commit/a6c1f0cf72ecb7f18bd0345a4b273c8361e3998c))

## 1.0.0 (2022-04-19)


### :bug: Fixes

* adjust the errors middlewares an custom error classes ([3b5d927](https://github.com/haandsolutions/haand-bib/commit/3b5d927179dbe8725d53676ed41500a5d9641a08)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)


### :barber: Style

* add eslint and prettier config to force and validate code style of the project ([d3dc99d](https://github.com/haandsolutions/haand-bib/commit/d3dc99d12414317211313c7764dd97787beef61f)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add exception rule for test files ([9eee522](https://github.com/haandsolutions/haand-bib/commit/9eee522554a1b8427747d8c4dcb3c5247cd9c383)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add generators to eslintignore ([27aacdc](https://github.com/haandsolutions/haand-bib/commit/27aacdcb1ab9e72742301a81c2b0d6739460f9e1)), closes [#57](https://github.com/haandsolutions/haand-bib/issues/57)
* add rule to force I in interfaces prefix ([9c6187d](https://github.com/haandsolutions/haand-bib/commit/9c6187d2a1d227993117d9e6f777093ced7e4ae6)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add rule to remove ununsed imports ([0eedb08](https://github.com/haandsolutions/haand-bib/commit/0eedb08f33a8e12cc46638aeefa16453139b85a7)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* adjust the indentation of file ([6b31e05](https://github.com/haandsolutions/haand-bib/commit/6b31e05edc75320a57d3d1994695a9291483b5d6)), closes [#10](https://github.com/haandsolutions/haand-bib/issues/10)
* remove unnecessary comments ([63871f3](https://github.com/haandsolutions/haand-bib/commit/63871f35cf512b5d8a5dda0b7af23b2bb57bad5a)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)


### :sparkles: New Features

* add class to handle database connection ([f276a47](https://github.com/haandsolutions/haand-bib/commit/f276a47938ddaf51dd21f0032a1e3de00a2a5711)), closes [#22](https://github.com/haandsolutions/haand-bib/issues/22)
* **consultant:** add commission parse to consultant service ([6b0e4eb](https://github.com/haandsolutions/haand-bib/commit/6b0e4ebd37aafb3add82ece73594374f406ca036)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* add config module to centralize all the environment variables ([6cec4bd](https://github.com/haandsolutions/haand-bib/commit/6cec4bd5646bf2b935204f3ad4244ebfa0edb1ba)), closes [#2](https://github.com/haandsolutions/haand-bib/issues/2)
* add custom error classes ([6c7a5bc](https://github.com/haandsolutions/haand-bib/commit/6c7a5bc56c39c97ce545cd7a729680cad001199f)), closes [#20](https://github.com/haandsolutions/haand-bib/issues/20)
* add generators to auto generate a new module with a crud ([e8284d3](https://github.com/haandsolutions/haand-bib/commit/e8284d377fb5ce0a3e59e268da8e95ea1da25c21)), closes [#57](https://github.com/haandsolutions/haand-bib/issues/57)
* add global middlewares (error handler, logger middleware and rate limit middleware) ([686f569](https://github.com/haandsolutions/haand-bib/commit/686f569b3050becc47eeebf67cf175f22e7393ca)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)
* add healthcheck feature to the project to check the status of the resources ([e5a1dd7](https://github.com/haandsolutions/haand-bib/commit/e5a1dd76400876429604b31baddfd2367ffb70b1)), closes [#16](https://github.com/haandsolutions/haand-bib/issues/16)
* add joi adapter to validate the values provided in the routes, functions and methods ([f857a46](https://github.com/haandsolutions/haand-bib/commit/f857a461564c2c94cbed77de66fa2cf993f1f5b5)), closes [#17](https://github.com/haandsolutions/haand-bib/issues/17)
* add loan simulation route ([77ac94e](https://github.com/haandsolutions/haand-bib/commit/77ac94e0709ffaad19e66af45906e6184cd9a98f)), closes [#31](https://github.com/haandsolutions/haand-bib/issues/31)
* add project startup to the application ([b3a98df](https://github.com/haandsolutions/haand-bib/commit/b3a98dfadb4ba32b990d2566883822ec4ed68352)), closes [#28](https://github.com/haandsolutions/haand-bib/issues/28)
* add swagger and swagger stats config in the project ([ddfa7c3](https://github.com/haandsolutions/haand-bib/commit/ddfa7c38280552cf2b664e6627c33ae5a9b33d81)), closes [#4](https://github.com/haandsolutions/haand-bib/issues/4)
* **consultant:** create consultant crud ([d85d0a2](https://github.com/haandsolutions/haand-bib/commit/d85d0a2504eb184389dfa28e08eae64fc853ecfc)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **db:** create Consultant model in prisma schema ([a0eabb6](https://github.com/haandsolutions/haand-bib/commit/a0eabb62cc71fe1631101e5895e0e603b5e94000)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* create controller interfaces ([b00c51d](https://github.com/haandsolutions/haand-bib/commit/b00c51d777a6f635688e86563d089968e9e8c81b))
* create express route adapter ([8e28c84](https://github.com/haandsolutions/haand-bib/commit/8e28c8422d7a1cb99193cb4723981e832d05f189))
* create GotAdapter ([aac8540](https://github.com/haandsolutions/haand-bib/commit/aac85408dd9deac5d86297bbca522f61ffd8a661))
* create HttpClient interfaces ([d0db745](https://github.com/haandsolutions/haand-bib/commit/d0db7454b457130c9a9fa3757577d23f5009f625))
* create HttpClientFactory ([f60627b](https://github.com/haandsolutions/haand-bib/commit/f60627beaa3c57033d41d26dfd2f959fa6dc31e5))
* create Logger interface ([4e3c194](https://github.com/haandsolutions/haand-bib/commit/4e3c19431b9d336dbad33fef4641bc24bec09cf7))
* create LoggerFactory ([67d5422](https://github.com/haandsolutions/haand-bib/commit/67d5422c3dfab486e779e2e91cd466320d8176f3))
* create LoggerManager class ([0c3f11b](https://github.com/haandsolutions/haand-bib/commit/0c3f11b4175d28fe8397c08f3ee33fd01fc2325f))
* create PinoAdapter ([668f6c0](https://github.com/haandsolutions/haand-bib/commit/668f6c02367afef5a064d49c2eee5dedb0affd31))
* **consultant:** update bind in middlewares ([c6a9078](https://github.com/haandsolutions/haand-bib/commit/c6a90789ce05e3c1308532d5d0f36fa690aec86f)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)


### :zap: Refactor

* adjust all the interfaces in the project to use I as prefix ([50c10da](https://github.com/haandsolutions/haand-bib/commit/50c10da0db59f931a84efb60d31f0d4b59198ae5)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* adjust loan simulation parameters schema ([49f6d3a](https://github.com/haandsolutions/haand-bib/commit/49f6d3a5549ba5a7752a3ac775693a3503144f7c))
* adjust pino adapter to receive a pino instance as default constructor parameter ([65a6fa9](https://github.com/haandsolutions/haand-bib/commit/65a6fa9087cc2f13a173d503dc39c8742bb9a219)), closes [#11](https://github.com/haandsolutions/haand-bib/issues/11)
* adjust the consultant crud to handle not found resources ([de9071f](https://github.com/haandsolutions/haand-bib/commit/de9071f30b51ee5906cbcf1dea84104e6cfe09dc)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* adjust the consultant router import ([5d3ea90](https://github.com/haandsolutions/haand-bib/commit/5d3ea905bf87c54910627c5662d14facede6f742))
* adjust the error middleware to abstract the error format ([b743bbc](https://github.com/haandsolutions/haand-bib/commit/b743bbc2f7f0402d3bb3a0889692a09ecb47357a)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)
* adjust the factory of consultant module ([5bc0bef](https://github.com/haandsolutions/haand-bib/commit/5bc0bef99199f05188ba22ccdc1ae35d1a1bad29))
* adjust the formater of express route adapter ([4c52d0a](https://github.com/haandsolutions/haand-bib/commit/4c52d0ad23755ddb2be269c741eb47cba4f474c9)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* adjust the imports of interfaces to use the correct name ([b376b84](https://github.com/haandsolutions/haand-bib/commit/b376b8472492206f3b727cfe18b49002464c5fe6)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)
* adjust the interface of express route params ([871eed1](https://github.com/haandsolutions/haand-bib/commit/871eed1c6f69bd357935c9d38c4738258f9b01f3)), closes [#10](https://github.com/haandsolutions/haand-bib/issues/10)
* adjust the interface of Logger to ILogger ([f88d12f](https://github.com/haandsolutions/haand-bib/commit/f88d12ffb13e17df55d3d94f5d0b842232059950)), closes [#28](https://github.com/haandsolutions/haand-bib/issues/28)
* adjust the interfaces of logger and add an interface to logger instance ([6e9ff13](https://github.com/haandsolutions/haand-bib/commit/6e9ff1385068833adfa02fe3b815324b381fdc19)), closes [#11](https://github.com/haandsolutions/haand-bib/issues/11)
* adjust the joi adapter class ([d6d6f9f](https://github.com/haandsolutions/haand-bib/commit/d6d6f9f5f7c4901fcd78cf5c50fc809a83476ac1)), closes [#17](https://github.com/haandsolutions/haand-bib/issues/17)
* adjust the joi adapter class ([585b284](https://github.com/haandsolutions/haand-bib/commit/585b2842dbb5cad5a97607654a94161c44626636)), closes [#17](https://github.com/haandsolutions/haand-bib/issues/17)
* adjust the joi adapter interface ([e1bbae2](https://github.com/haandsolutions/haand-bib/commit/e1bbae2226296bdef0ca553b3fb961cf7674489e))
* adjust the logger manager constructor to have and default logger ([7db8971](https://github.com/haandsolutions/haand-bib/commit/7db89716f8aa7a2a0e2dfe506c37a3ffd7dbb7a6)), closes [#11](https://github.com/haandsolutions/haand-bib/issues/11)
* adjust the method names of consultant module ([0c8a70d](https://github.com/haandsolutions/haand-bib/commit/0c8a70d39a18904db627d137c8d5c105874e9f91)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* adjust the pino adapter to not log in test environment ([24b1a57](https://github.com/haandsolutions/haand-bib/commit/24b1a57f1b233bcaf1f8b692b5cbe5c889291e6f))
* adjust the rule of loan simulation installments calc ([dad1472](https://github.com/haandsolutions/haand-bib/commit/dad1472afebb21ac2884e195392f41fd18991392))
* change the method format access to be static ([b6d2338](https://github.com/haandsolutions/haand-bib/commit/b6d2338e51573284d97edcf6ff41b1762b286f7b))
* **joi-adapter:** create interface contract for joi adapter ([893464b](https://github.com/haandsolutions/haand-bib/commit/893464bd000f32459ebe3c7dc8bee50d1f735cd5)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** create interface for consultant service ([5ca5fdd](https://github.com/haandsolutions/haand-bib/commit/5ca5fdd415075f9e356f62376460e4f5180c111e)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* move http client interface to separated folder ([eb395b1](https://github.com/haandsolutions/haand-bib/commit/eb395b13488e859954a54dd99f7f55ce432b3240))
* move logger interface to separated folder ([9f32314](https://github.com/haandsolutions/haand-bib/commit/9f32314d06ebb2889701fbdcafb38f2e4e001291))
* **abstract database connection:** remove AbstractDatabaseConnection ([86978d2](https://github.com/haandsolutions/haand-bib/commit/86978d2bd7509942d72a9947fa909a840f10e630)), closes [#11](https://github.com/haandsolutions/haand-bib/issues/11)
* remove error handler class because it just log the error ([037f4f7](https://github.com/haandsolutions/haand-bib/commit/037f4f78ce8a97b72f35a2f19de08e1e35b8683c)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)
* remove unnecessary default values ([8f222b1](https://github.com/haandsolutions/haand-bib/commit/8f222b16b22f08536cf4ce867cc9e2c302c5f23f))
* **consultant:** update consultant schema ([98c257b](https://github.com/haandsolutions/haand-bib/commit/98c257ba0dac7e4cb5ed2636d35d066890bfc577)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** update consultant service to depends of interface ([e98393c](https://github.com/haandsolutions/haand-bib/commit/e98393c555cab8dbe25059270054a3d1398079c8)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** update consultant signature ([f314108](https://github.com/haandsolutions/haand-bib/commit/f3141082ab17fd5708c812961881cb3fce32e9dd)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **jest:** update jest setup to mock date time ([2b48589](https://github.com/haandsolutions/haand-bib/commit/2b485891a439cf3f5b3a1ca14060e4808da96914)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)


### :white_check_mark: Tests

* add integration tests of global middlewares ([8a640fb](https://github.com/haandsolutions/haand-bib/commit/8a640fb8c2912b93670fca66ba3ffee5a442a6a3))
* add integration tests of healthcheck module ([af89af2](https://github.com/haandsolutions/haand-bib/commit/af89af2a5598f9f83dcab4757c1cc433ad1876c8))
* add integration tests to loan simulation module ([cd0ec9f](https://github.com/haandsolutions/haand-bib/commit/cd0ec9f5b087244dca295c4ea6bf363d5e20cef0)), closes [#31](https://github.com/haandsolutions/haand-bib/issues/31)
* add junit reports for jest config ([a1e4799](https://github.com/haandsolutions/haand-bib/commit/a1e4799afd119bc49f8e6869d8fd3cfbcae769d4))
* add mutation tests config ([1c3d05d](https://github.com/haandsolutions/haand-bib/commit/1c3d05d77ee75767a71ad1fc00d9d4eb704d04a8)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add tests to joi adapter ([7a43010](https://github.com/haandsolutions/haand-bib/commit/7a430100332a8eb0cbf2112a145d0658a7230471)), closes [#17](https://github.com/haandsolutions/haand-bib/issues/17)
* add tests to unexpected exceptions in consultants routes ([0e2baae](https://github.com/haandsolutions/haand-bib/commit/0e2baae9526974247bc330048c1ef12b12453647))
* add unit tests of error middleware ([9d20d58](https://github.com/haandsolutions/haand-bib/commit/9d20d58aca17147e60c6d30fae719e4f7299bfcf)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)
* add unit tests of loan simulation module ([c167b3e](https://github.com/haandsolutions/haand-bib/commit/c167b3e6ecfa5701fe7c1bac4d9bb3d530bc0135)), closes [#31](https://github.com/haandsolutions/haand-bib/issues/31)
* add unit tests of mySqlClient ([df0cc52](https://github.com/haandsolutions/haand-bib/commit/df0cc523de7b0354fd2e51d101f04d6682bea27d)), closes [#22](https://github.com/haandsolutions/haand-bib/issues/22)
* add unit tests to healthcheck module ([e5d7f2e](https://github.com/haandsolutions/haand-bib/commit/e5d7f2ee5d9f6bd078f414ecfebd159293416fa8)), closes [#16](https://github.com/haandsolutions/haand-bib/issues/16)
* adjust jest config to genarete separated artefacts ([767db5f](https://github.com/haandsolutions/haand-bib/commit/767db5f074c5554d54945f18eab85d977f3ac727))
* adjust the coverage file patterns config to track correctly ([7f4d10f](https://github.com/haandsolutions/haand-bib/commit/7f4d10fb1fd2195902a150d6de8b3e3785c82430)), closes [#6](https://github.com/haandsolutions/haand-bib/issues/6)
* adjust the fixtures of loan simulation module ([c8705aa](https://github.com/haandsolutions/haand-bib/commit/c8705aa3dee4cd2736e4e641b6e78c992b1bb92f))
* adjust the imports of tests ([134db69](https://github.com/haandsolutions/haand-bib/commit/134db69d4da09c07383f67079518b7d9a0424380))
* adjust the jest config to ignore openapi config file ([de3320d](https://github.com/haandsolutions/haand-bib/commit/de3320d7162bf0c9ef10ef553e3e282824bde208)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)
* adjust the jest config to ignore swagger files in coverage ([22ce8d6](https://github.com/haandsolutions/haand-bib/commit/22ce8d6f36cf73129ec6b492739043e2d51675ab))
* adjust the jest coverage config ([5ca7156](https://github.com/haandsolutions/haand-bib/commit/5ca71564960d0a3bc4b16f9c7b738642b7d3690a)), closes [#36](https://github.com/haandsolutions/haand-bib/issues/36)
* adjust the test coverage threshould to 95% ([7445e88](https://github.com/haandsolutions/haand-bib/commit/7445e8809bda3ef69b9494ec63a2dd8e83eabd33))
* adjust the tests of consultant service to coverage not found flows ([735b0fa](https://github.com/haandsolutions/haand-bib/commit/735b0fa297c980d08fb386e78d29082aebbbe211)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* adjust the tests of express adapter ([ad1ee9b](https://github.com/haandsolutions/haand-bib/commit/ad1ee9bd3149d8581510f2bfc98b206bcea383d8)), closes [#10](https://github.com/haandsolutions/haand-bib/issues/10)
* adjust the tests to use a new structure of mock factories ([8104de6](https://github.com/haandsolutions/haand-bib/commit/8104de6f34c0e8e6aecd8826982ce74704c20db4)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* adjust the tests to use the ILogger interface ([16dcb8d](https://github.com/haandsolutions/haand-bib/commit/16dcb8dd41d7d0570f960e7371b567c57e7d056a)), closes [#28](https://github.com/haandsolutions/haand-bib/issues/28)
* adjust the unit tests of joi adapter ([2ac4615](https://github.com/haandsolutions/haand-bib/commit/2ac461538e5d54e5cfa172f55a3639694404978d)), closes [#17](https://github.com/haandsolutions/haand-bib/issues/17)
* adjust the unit tests of joi adapter ([bab9e58](https://github.com/haandsolutions/haand-bib/commit/bab9e58c9783b7e5fc4d39b1d8d395e119c9755e)), closes [#17](https://github.com/haandsolutions/haand-bib/issues/17)
* adjust the unit tests of loan simulation module ([363e358](https://github.com/haandsolutions/haand-bib/commit/363e358a919c878b3ead3a1a7daf19a87ab6b900))
* adjust the unit tests of logger manager ([fb9dffd](https://github.com/haandsolutions/haand-bib/commit/fb9dffdac99868847af6ae232656bfed09604515)), closes [#11](https://github.com/haandsolutions/haand-bib/issues/11)
* adjust unit tests of pino adapter ([6304801](https://github.com/haandsolutions/haand-bib/commit/63048012fb8f17a839b60e7109b35a9f44755a89)), closes [#11](https://github.com/haandsolutions/haand-bib/issues/11)
* **consultant:** create consultant controller tests ([9b03032](https://github.com/haandsolutions/haand-bib/commit/9b03032bd47e926e79d0f9832b0e571090768b47)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** create consultant factory tests ([1dff892](https://github.com/haandsolutions/haand-bib/commit/1dff892bef013bb829f72ab7ebe1fcbd3186a204)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** create consultant repository tests ([05888e5](https://github.com/haandsolutions/haand-bib/commit/05888e5ab938bfe3f09c5fe9fa3aecc89eb5be28)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** create consultant schema test ([4bb07cc](https://github.com/haandsolutions/haand-bib/commit/4bb07ccf751a267ec885388176ada857f8f14c9c)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** create consultant service tests ([4a1bdd2](https://github.com/haandsolutions/haand-bib/commit/4a1bdd2a5eecb6042a6b3fb4b1340dd07c1a6391)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** create funcional tests for consultants ([b0ff895](https://github.com/haandsolutions/haand-bib/commit/b0ff8951af0fdd0cd02e0d34b6cb6ec7070d067f)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* **consultant:** create test helper ([d566e85](https://github.com/haandsolutions/haand-bib/commit/d566e85cdbe648555e739c5101a2b8db3b096b1c)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* create test helper for controller ([c8a4a34](https://github.com/haandsolutions/haand-bib/commit/c8a4a34d66ccc883e2e29e2911bc73fd98dc9100))
* create test helper for express ([6ef33bb](https://github.com/haandsolutions/haand-bib/commit/6ef33bba1e55eb52d5baba1e95f51de0a53a5ecc))
* create TestHelper for Logger interface ([2c7b032](https://github.com/haandsolutions/haand-bib/commit/2c7b032b3214aab1d393642012b45854aced2403))
* refactor the consultant module integration tests ([0c2167b](https://github.com/haandsolutions/haand-bib/commit/0c2167b47179b8e167d7b330e76fc33940b69841)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)
* remove junit reports ([0e2d426](https://github.com/haandsolutions/haand-bib/commit/0e2d426c48060fc28e430ff9583cbfbd0982ffe7))
* remove the config module from coregvcoverage ([514d829](https://github.com/haandsolutions/haand-bib/commit/514d829f8de50fb1aecf793b234a6c7ac0bd3163))
* **test-helper:** update consultant test helper mocks ([257e4e9](https://github.com/haandsolutions/haand-bib/commit/257e4e931b86950ca6b49a3a1f4dc1367f9982ce)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)


### :repeat: CI

* add commitlint to validate commit messages ([d22121d](https://github.com/haandsolutions/haand-bib/commit/d22121dfe30e518f3937f78c0f883980551aac7b)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add husky config to make easier handle git hooks ([0a493f5](https://github.com/haandsolutions/haand-bib/commit/0a493f52d4b82d45bcea1df881ff76201ea71e57)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add lintstaged config to run scripts just on staged files ([9bf20b8](https://github.com/haandsolutions/haand-bib/commit/9bf20b87ce65f5fc2488d9e5db2e6925f30442b7)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add new rules to commitlint to check commit body and footer ([4108f6c](https://github.com/haandsolutions/haand-bib/commit/4108f6c6cece6d564a4ff8c65a3146c98aa26cce)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* add pipeline artifact upload step ([e8147e3](https://github.com/haandsolutions/haand-bib/commit/e8147e3b25c8fea11343f8d0c0c1da69564a5c68))
* add pull request validation workflow ([94ed3c8](https://github.com/haandsolutions/haand-bib/commit/94ed3c8fcd2aad42492a2888c9f45be326d7ec8d))
* add release workflow to run the tests, generate a release and deploy the app on heroku ([f6da623](https://github.com/haandsolutions/haand-bib/commit/f6da623bb4197612d0209a1dbd0d0781aae4d53f))
* add semantic release config ([1f42313](https://github.com/haandsolutions/haand-bib/commit/1f42313a9923700bdaa7f7b8542770ed70ea0346)), closes [#3](https://github.com/haandsolutions/haand-bib/issues/3)
* adjust the command of lintstaged to use lint:fix ([edf5860](https://github.com/haandsolutions/haand-bib/commit/edf5860e59fc6647a271fde294b009e268edf361)), closes [#28](https://github.com/haandsolutions/haand-bib/issues/28)
* adjust the generate code coverage step ([c63d1e9](https://github.com/haandsolutions/haand-bib/commit/c63d1e99dfab7e4e3eb9dfafb29889e28f20c13f))
* adjust the pipeline of pull request validation to continue pipeline on tests error ([307fee7](https://github.com/haandsolutions/haand-bib/commit/307fee7ef3e5b28d247c97de57bcbe420a43df3b))
* adjust the steps to generate jest coverage report ([5ae0a26](https://github.com/haandsolutions/haand-bib/commit/5ae0a261e224a9cfc1ce765f1f22ebb4199c24c8))


### :memo: Documentation

* add homolog server on swagger docs ([7095c86](https://github.com/haandsolutions/haand-bib/commit/7095c86191c72ceab5fc0151dc2b325f6ff68b58))
* add swagger docs of loan simulation module ([abbe7d8](https://github.com/haandsolutions/haand-bib/commit/abbe7d83be217ae29c60e7850dc3ac99551c608a)), closes [#31](https://github.com/haandsolutions/haand-bib/issues/31)
* add swagger specification file ([8eb82d4](https://github.com/haandsolutions/haand-bib/commit/8eb82d48170372db7a8bfa18a07595b031cad5ce)), closes [#4](https://github.com/haandsolutions/haand-bib/issues/4)
* adjust the documentation of healthcheck route ([4f4158a](https://github.com/haandsolutions/haand-bib/commit/4f4158adff9bae8d60652924fa4595c04ec79f4f)), closes [#4](https://github.com/haandsolutions/haand-bib/issues/4)
* adjust the swagger definitions in separated files ([916e418](https://github.com/haandsolutions/haand-bib/commit/916e418a2e98fb250e474e599c9c15a420f35d8b)), closes [#4](https://github.com/haandsolutions/haand-bib/issues/4)
* adjust the tags of swagger docs ([725a0d5](https://github.com/haandsolutions/haand-bib/commit/725a0d505288fec89d3ecbdccb7aedaff92a62c4))
* change the name of the project ([128fd6b](https://github.com/haandsolutions/haand-bib/commit/128fd6b29ae584f9b50d3f04230509f101b151c5)), closes [#1](https://github.com/haandsolutions/haand-bib/issues/1)
* **consultant:** create consultant swagger docs ([8878f63](https://github.com/haandsolutions/haand-bib/commit/8878f63fb61720b37ffec1b6e4c7fc5e2671c73f)), closes [#32](https://github.com/haandsolutions/haand-bib/issues/32)