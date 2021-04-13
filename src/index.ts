import * as fs from "fs";
import * as path from "path";

import { Command, flags } from "@oclif/command";

const kHzFreqs: number[] = [
	1,
	2,
	4,
	6,
	8,
	10,
	20,
	40,
	60,
	80,
	100,
	200,
	400,
	600,
	800,
	1000,
	2000,
	4000,
	6000,
	8000,
	10000,
	20000,
	40000,
	60000,
	80000,
	100000
];

class KicadSimParser extends Command {
	static description =
		"Reads input CSV file with te first line being time series & the next ones being characteristics values from the KiCad Spice simulation (e.g. phase, magnitude) & writes probed values to output CSV file";

	static flags = {
		version: flags.version({ char: "v" }),
		help: flags.help({ char: "h" }),
		in: flags.string({
			char: "i",
			description: "input .csv file path; the first line should contain time series",
			required: true
		}),
		out: flags.string({
			char: "o",
			description: "output .csv file path",
			required: true
		})
	};

	static args = [];

	async run() {
		const { args, flags } = this.parse(KicadSimParser);

		const inPath = path.resolve(flags.in),
			outPath = path.resolve(flags.out);

		if (!fs.existsSync(inPath)) {
			this.error(`Input file ${inPath} does not exist!`);
		}

		this.log(`Reading from ${inPath}\n`);

		let rows = fs
				.readFileSync(inPath)
				.toString()
				.split(/\r?\n/)
				.filter((row) => row.trim().length)
				.map((row) =>
					row
						.replace(/,/g, ".")
						.split(";")
						.filter((row) => row.length)
						.map((val, index) => (index === 0 ? val : Number(val)))
				),
			labels = rows.map((row) => row[0]);

		rows = rows.map((row) => row.filter((_, index) => index !== 0));

		const findIndexNearest = (val: number) => {
			for (let index = 0; index < rows[0].length; index++) {
				if (rows[0][index] === val) {
					return index;
				} else if (index + 1 < rows[0].length && val < rows[0][index + 1]) {
					return index;
				}
			}

			this.warn(`Warning: corresponding exponential index for val ${val} not found`);

			return rows[0].length - 1;
		};

		const firstX = rows[0][0],
			lastX = rows[0][rows[0].length - 1];

		this.log(`Detected first freq = ${firstX} Hz, last freq = ${lastX} Hz`);

		let outRows = labels.map((label) => [label]);

		this.log(`Trying to get ${kHzFreqs.length} closest probes`);

		// logspace(Math.log10(firstX / 10), Math.log10(lastX / 10), 25)
		for (let val of kHzFreqs.map((kHz) => kHz * 1000)) {
			const index = findIndexNearest(val);

			for (let r = 0; r < outRows.length; r++) {
				outRows[r].push(String(rows[r][index]).replace(".", ","));
			}
		}

		let repetitionIndexes = outRows[0]
			.map((x, index, arr) => (x === arr[index + 1] ? index : null))
			.filter((i) => i !== null);

		outRows = outRows.map((row) =>
			row.filter((_, index) => !repetitionIndexes.includes(index))
		);

		this.log(
			`Removed ${repetitionIndexes.length} probe repetitions (output entries length: ${outRows[0].length})`
		);

		fs.writeFileSync(outPath, outRows.map((row) => row.join(";")).join("\n"));

		this.log(`\nWritten output to ${outPath}`);
	}
}

export = KicadSimParser;
