import * as Benchmark from "benchmark";

const bench = new Benchmark.Suite();

////////////////////////////////

import * as jsBuildQuery from "http-build-query";

import * as path from "node:path";
const { httpBuildQuery: cppBuildQuery } = require(path.join(__dirname, "../../dist/lib/main.node"));

////////////////////////////////

const object_1 = {
	id: 777,
	message: `hello`,
	token: `x2s7d`
};

const object_2 = {
	user: {
		name: `Bob Smith`,
		age: 47,
		sex: `M`,
		dob: `5/12/1956`
	},
	pastimes: [`golf`, `opera`, `poker`, `rap`],
	children: {
		bobby: {
			age: 12,
			sex: `M`
		},
		sally: {
			age: 8,
			sex: `F`
		}
	},
	[`+0`]: `CEO`
};
/////////////////////////////

bench.add(`\nC++ Query Builder -> Object 1`, function () {
    cppBuildQuery(object_1);
});

bench.add(`\nJS Query Builder -> Object 1`, function () {
    jsBuildQuery(object_1);
});

bench.add(`\nC++ Query Builder -> Object 2`, function () {
    cppBuildQuery(object_2);
});

bench.add(`\nJS Query Builder -> Object 2`, function () {
    jsBuildQuery(object_2);
});

/////////////////////////////

bench.on('cycle', function (e) {
    console.log(e.target.toString());
});

// bench.on('complete', function () {
//     console.log('Fastest is ' + this.filter('fastest').map('name'));
// });

bench.run();
