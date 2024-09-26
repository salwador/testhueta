import * as path from "node:path";
const { httpBuildQuery } = require(path.join(__dirname, "../dist/lib/main.node"));

////////////////////////////////

export default httpBuildQuery;