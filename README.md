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

Changes from IBANTools 4.5.4:

- `extractIBAN()` returns `bankIdentifier` for SK, SM, SO, ST, SV, TL, TN, TR, UA, VA, VG and XK
  ([upstream PR #694](https://github.com/Simplify/ibantools/pull/694)).
- `script/builder.rb` reads registry cells that span lines, which had dropped those countries' bank positions.
- The registry builder is JavaScript (`script/builder.js`, run with `npm run build-spec`) instead of Ruby, so the
  project needs only Node. It also writes account ranges the way `extractIBAN()` reads them, inclusive: the Ruby builder
  wrote them one character too long, which contributors had been correcting by hand country by country.
- `npm run update-registry` checks a newly downloaded SWIFT registry saved as `script/registry.txt`, and
  `npm run update-src` carries the registry's values into `src/ibantools.ts` without overwriting anything (see
  [Updating the IBAN registry](#updating-the-iban-registry)).

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

## Updating the IBAN registry

`script/registry.txt` is a copy of the SWIFT IBAN registry, and `script/iban_spec.js` is built from it. The library
itself, `src/ibantools.ts`, is updated from it in place rather than regenerated, because it also holds national checks,
countries the registry lacks and fixes to registry values.

1. In a browser, download the registry as text from the
   [SWIFT IBAN page](https://www.swift.com/standards/data-standards/iban-international-bank-account-number).
   SWIFT blocks scripted downloads, so this step is manual.
2. Save it as `registry.txt` in the `script` folder, replacing the old one, and run `npm run update-registry`.
   It refuses a file that isn't the full registry. On run, it lists the countries added, removed or changed since the last
   commit, and rebuilds `script/iban_spec.js`.
3. Run `npm run update-src` to carry the registry into `src/ibantools.ts` (add `-- --dry-run` to only see the report).
   It adds what `src/ibantools.ts` lacks, such as a missing bank position, and reports every value that differs from
   the registry. It changes a differing value only when run with `-- --overwrite`, and never one marked as a fix.
   It also lists what it skipped, such as an empty account range from a registry example without an account number.
4. Review `git diff`, decide on each reported difference, and add tests for what changed.

A value fixed by hand carries a comment on the line above it, starting with `// Not from the IBAN registry:`, saying
why and where it was fixed:

```ts
    // Not from the IBAN registry: its 5-digit bank code is a 2-digit bank and a 3-digit branch code (#452).
    bank_identifier: '0-1',
```

`npm run update-src` never changes a marked value, and tells you when the registry agrees with it again so the comment
can go. Mark any value you fix by hand the same way.

`npm run build-spec` rebuilds `script/iban_spec.js` from the current registry without replacing it.

## Contributing

Please send fixes to the [original project](https://github.com/Simplify/ibantools) first, following its
[contribution guide](https://github.com/Simplify/ibantools/blob/master/CONTRIBUTING.md).
Report problems specific to this fork in [our issues](https://github.com/flash-oss/ibantools/issues).

## License

This work is dual-licensed under MIT and MPL-2.0.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: MIT OR MPL-2.0`
