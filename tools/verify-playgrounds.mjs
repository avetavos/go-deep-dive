// Verify every EN playground snippet compiles, vets clean, and runs.
// Usage: node tools/verify-playgrounds.mjs [pathFilter]
// Snippets needing Go 1.27 are skipped locally — run them on go.dev instead:
//   curl -s -X POST https://go.dev/_/compile --data-urlencode version=2 \
//     --data-urlencode withVet=true --data-urlencode "body@main.go"
import { readFileSync, mkdirSync, writeFileSync, globSync } from 'node:fs';
import { execSync } from 'node:child_process';

const GO127 = new Set(['genericMethodsCode', 'jsonV2Code']);
const filter = process.argv[2] ?? '';
const files = globSync('src/content/docs/en/**/*.mdx').filter((f) => f.includes(filter));

let fail = 0;
let n = 0;
for (const f of files.sort()) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/export const (\w+Code) = `([\s\S]*?)`;\n/g)) {
    n++;
    if (GO127.has(m[1])) {
      console.log(`SKIP ${f} ${m[1]} (needs go.dev)`);
      continue;
    }
    const code = Function('return `' + m[2] + '`')();
    const dir = `.verify/${f.replace(/[\/.]/g, '_')}_${m[1]}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/main.go`, code);
    try {
      const out = execSync(`cd ${dir} && go vet main.go && go run main.go`, {
        stdio: 'pipe',
        timeout: 30000,
      });
      console.log(`OK   ${f} ${m[1]}\n--- stdout ---\n${out.toString()}--------------`);
    } catch (e) {
      fail++;
      console.log(`FAIL ${f} ${m[1]}\n${String(e.stderr).slice(0, 400)}`);
    }
  }
}
console.log(`${n} playgrounds, ${fail} failed`);
process.exit(fail ? 1 : 0);
