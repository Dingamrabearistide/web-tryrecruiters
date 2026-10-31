/***
 * MIGRATE TO VERSION 20
 * # 18 -> 19
pnpm ng update @angular/core@19 @angular/cli@19
pnpm ng update @angular/material@19
pnpm install
pnpm build

# 19 -> 20
pnpm ng update @angular/core@20 @angular/cli@20
pnpm ng update @angular/material@20
pnpm install
pnpm build

# builder Angular 20, si nécessaire
pnpm remove @angular-devkit/build-angular
pnpm add -D @angular/build@^20.3.5
pnpm build
 */

const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(process.cwd(), "src");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".ts")) continue;
    if (entry.name.endsWith(".spec.ts")) continue;

    let content = fs.readFileSync(fullPath, "utf8");
    let original = content;

    content = content.replace(
      /@(Component|Directive|Pipe)\s*\(\s*\{([\s\S]*?)\}\s*\)/g,
      (match, decorator, body) => {
        if (/\bstandalone\s*:/.test(body)) {
          return match;
        }

        const trimmedBody = body.trimStart();

        return `@${decorator}({\n  standalone: false,\n${trimmedBody ? body : ""}})`;
      },
    );

    if (content !== original) {
      fs.writeFileSync(fullPath, content, "utf8");
      console.log(`updated ${path.relative(process.cwd(), fullPath)}`);
    }
  }
}

walk(SRC_DIR);
