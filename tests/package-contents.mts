import assert from "node:assert";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * If this test fails, the list of files published to npm has changed.
 *
 * If that is intentional (for example you added a rule or a doc), update the
 * snapshot and commit it:
 *
 *    UPDATE_SNAPSHOTS=1 npm test
 *
 * If you did not expect the change, review it: we don't want to publish too
 * many files, or not enough.
 */
const root = path.resolve(import.meta.dirname, "..");
const snapshotFile = path.join(import.meta.dirname, "snapshots/package-files.txt");

function packedFiles(): string[] {
  // --ignore-scripts: dist/ is already built by pretest, skip the prepack rebuild.
  const output = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: root,
    encoding: "utf8",
  });
  const [{ files }] = JSON.parse(output) as [{ files: { path: string }[] }];
  return files.map((f) => f.path).sort();
}

describe("npm package contents", () => {
  it("should ship the expected files and no more", function () {
    // npm pack is slow on cold caches.
    this.timeout(30_000);
    const actual = `${packedFiles().join("\n")}\n`;
    if (process.env.UPDATE_SNAPSHOTS) {
      fs.mkdirSync(path.dirname(snapshotFile), { recursive: true });
      fs.writeFileSync(snapshotFile, actual);
      return;
    }
    assert.ok(fs.existsSync(snapshotFile), `Missing ${snapshotFile}, run with UPDATE_SNAPSHOTS=1`);
    assert.equal(actual, fs.readFileSync(snapshotFile, "utf8"));
  });
});
