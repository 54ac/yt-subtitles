import fs from "node:fs";
import { execSync } from "node:child_process";

fs.rmSync("amo-metadata.json", { force: true });

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const tag = `v${pkg.version}`;
execSync(`git tag ${tag} && git push origin ${tag}`, { stdio: "inherit" });

