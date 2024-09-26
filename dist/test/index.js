"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uvu_1 = require("uvu");
const assert = require("uvu/assert");
const qs = require("qs");
const jsBuildQuery = require("http-build-query");
const path = require("node:path");
const { httpBuildQuery: cppBuildQuery } = require(path.join(__dirname, "../../dist/lib/main.node"));
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
(0, uvu_1.test)(`Test Object 1`, async () => {
    console.log(`cpp ->`, cppBuildQuery(object_1));
    console.log(`js ->`, jsBuildQuery(object_1));
    assert.equal(qs.parse(cppBuildQuery(object_1)), qs.parse(jsBuildQuery(object_1)));
});
(0, uvu_1.test)(`Test Object 2`, async () => {
    console.log(`cpp ->`, cppBuildQuery(object_2));
    console.log(`js ->`, jsBuildQuery(object_2));
    assert.equal(qs.parse(cppBuildQuery(object_2)), qs.parse(jsBuildQuery(object_2)));
});
uvu_1.test.run();
//# sourceMappingURL=index.js.map