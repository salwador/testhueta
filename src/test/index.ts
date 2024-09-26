import { test } from "uvu";
import * as assert from "uvu/assert";

import * as qs from "qs";

////////////////////////////////

import * as jsBuildQuery from "http-build-query";

import * as path from "node:path";
const { httpBuildQuery: cppBuildQuery } = require(path.join(__dirname, "../../dist/lib/main.node"));

////////////////////////////////

const object_1 = {
	id: 777,
	message: `hello`,
	token: `x2s7d`,
	weight: 54.3,
	btc_balance: 0.00068
};

const object_2 = {
	user: {
		name: `Bob Smith`,
		age: 47,
		weight: 13.99,
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
	bank_balance: 165498.22268,
	[`+0`]: `CEO`
};

////////////////////////////////

test(`Test Object 1`, async () => {
	console.log(`cpp ->`, cppBuildQuery(object_1));
	console.log(`js ->`, jsBuildQuery(object_1));

	assert.equal(
		qs.parse(cppBuildQuery(object_1)),
		qs.parse(jsBuildQuery(object_1)), 
	);
});

test(`Test Object 2`, async () => {
	console.log(`cpp ->`, cppBuildQuery(object_2));
	console.log(`js ->`, jsBuildQuery(object_2));

	assert.equal(
		qs.parse(cppBuildQuery(object_2)),
		qs.parse(jsBuildQuery(object_2)), 
	);
});

// %2B0=CEO&children%5Bbobby%5D%5Bage%5D=12&children%5Bbobby%5D%5Bsex%5D=M&children%5Bsally%5D%5Bage%5D=8&children%5Bsally%5D%5Bsex%5D=F&pastimes%5B0%5D=golf&pastimes%5B1%5D=opera&pastimes%5B2%5D=poker&pastimes%5B3%5D=rap&user%5Bage%5D=47&user%5Bdob%5D=5%2F12%2F1956&user%5Bname%5D=Bob%20Smith&user%5Bsex%5D=M

// user%5Bname%5D=Bob+Smith&user%5Bage%5D=47&user%5Bsex%5D=M&user%5Bdob%5D=5%2F12%2F1956&pastimes%5B0%5D=golf&pastimes%5B1%5D=opera&pastimes%5B2%5D=poker&pastimes%5B3%5D=rap&children%5Bbobby%5D%5Bage%5D=12&children%5Bbobby%5D%5Bsex%5D=M&children%5Bsally%5D%5Bage%5D=8&children%5Bsally%5D%5Bsex%5D=F&%2B0=CEO

////////////////////////////////

test.run();