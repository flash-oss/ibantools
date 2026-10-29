# ibantools-flash

![License](https://img.shields.io/badge/License-MIT-blue)
![License](https://img.shields.io/badge/License-MPL_2.0-blue)
[![npm version](https://img.shields.io/npm/v/ibantools-flash)](https://www.npmjs.com/package/ibantools-flash)

## A fork of IBANTools

This is [Flash Payments](https://flash-payments.com)' fork of [IBANTools](https://github.com/Simplify/ibantools) by
[Saša Jovanić](https://www.simplify.ba/). IBANTools is an excellent, carefully maintained library, and almost all of the
work here is his and its contributors'. Thank you!

We forked it to use fixes and improvements we need without waiting for upstream releases. We would be glad to see
our changes merged into the original project, and we offer them where they fit, but it is up to its maintainers
whether they want them.

### What's different from IBANTools 4.5.4

The API is the same. `extractIBAN()` returns `bankIdentifier` for SK, SM, SO, ST, SV, TL, TN, TR, UA, VA, VG and XK,
which the registry builder had lost ([upstream PR #694](https://github.com/Simplify/ibantools/pull/694)). See the
[ChangeLog](https://github.com/flash-oss/ibantools/blob/master/ChangeLog) for details.

## About

IBANTools is TypeScript/JavaScript library for validation, creation and extraction of IBAN, BBAN and BIC/SWIFT numbers.

For more information about IBAN/BBAN see [wikipedia page](https://en.wikipedia.org/wiki/International_Bank_Account_Number) and
[IBAN registry](https://www.swift.com/resource/iban-registry-pdf).

For more information about BIC/SWIFT see [this wikipedia page](https://en.wikipedia.org/wiki/ISO_9362).

## Installation

```
$ npm install ibantools-flash
```

To keep `require('ibantools')` in your code unchanged, install it under the original name with an npm alias:

```
$ npm install ibantools@npm:ibantools-flash
```

## Usage

The API is the same as IBANTools; see its [full documentation](http://simplify.github.io/ibantools) with examples.

### Node.js - CommonJS

```js
const ibantools = require('ibantools-flash');
const iban = ibantools.electronicFormatIBAN('NL91 ABNA 0417 1643 00'); // 'NL91ABNA0417164300'
ibantools.isValidIBAN(iban);

// If you want to know reason why IBAN is invalid
ibantools.validateIBAN('NL91ABNA0517164300');
// Returns { valid: false, errorCodes: [iban.ValidationErrorsIBAN.WrongIBANChecksum] }

// Validate BIC
ibantools.isValidBIC('ABNANL2A');
```

### ES modules

```js
import { isValidIBAN, extractIBAN } from 'ibantools-flash';
```

### With TypeScript

The package bundles type definitions, so `tsc` picks them up automatically.

### Extension

Country specifications can be extended with national BBAN validations by calling `setCountryBBANValidation`.

For example, to fully syntactically check German IBAN, you can install [IBANTools-Germany](https://github.com/baumerdev/ibantools-germany) and add this with

```
const ibantools = require('ibantools-flash');
const ibantoolsGermany = require("ibantools-germany");
ibantools.setCountryBBANValidation("DE", ibantoolsGermany.isValidBBAN);
```

## Contributing

Please send fixes to the [original project](https://github.com/Simplify/ibantools) first, following its
[contribution guide](https://github.com/Simplify/ibantools/blob/master/CONTRIBUTING.md).
Report problems specific to this fork in [our issues](https://github.com/flash-oss/ibantools/issues).

## License

This work is dual-licensed under MIT and MPL-2.0.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: MIT OR MPL-2.0`
