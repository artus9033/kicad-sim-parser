# kicad-sim-parser

A simple KiCad Spice frequency simulation parser &amp; prober

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/kicad-sim-parser.svg)](https://npmjs.org/package/kicad-sim-parser)
[![Downloads/week](https://img.shields.io/npm/dw/kicad-sim-parser.svg)](https://npmjs.org/package/kicad-sim-parser)
[![License](https://img.shields.io/npm/l/kicad-sim-parser.svg)](https://github.com/artus9033/kicad-sim-parser/blob/master/package.json)

-   [Usage](#usage)
-   [Commands](#commands)

# Installation

You can download automatically precompiled release binaries from the [releases page](https://github.com/artus9033/kicad-sim-parser/releases) or install manually from NPM:

```sh-session
$ npm install -g kicad-sim-parser
```

# Usage

Reads input CSV file with te first line being time series & the next ones being characteristics values from the KiCad Spice simulation (e.g. phase, magnitude) & writes probed values to output CSV file.

What it does is essentialy a basic automatization of the human process of reading two data categories in ~20 different frequency points on the Spice simulator's GUI.
This project is meant to make things faster & easier (read: automatic).

```sh-session
USAGE
$ kicad-sim-parser

OPTIONS
-h, --help show CLI help
-i, --in=in (required) input .csv file path; the first line should contain time series
-o, --out=out (required) output .csv file path
-v, --version show CLI version
```

Example usage:

```sh-session
$ kicad-sim-parser -i simulation.csv -o probedResults.csv
```
