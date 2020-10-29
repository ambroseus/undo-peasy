import { build as esbuild } from "esbuild";

/** Basic typescript build script
 * commands:
 *  --tasks     list tasks
 *  dev         build dev bundle continually
 *  prod        build production bundle
 *
 * source directories:
 *   src/      .ts/.tsx source files
 * output directories:
 *   web/      debug bundle (includes source map)
 *   dist/     production bundle
 */

const productionOutDir = "dist";
const devOutDir = "web";
const defaultCmd = "dev";
const entryPoints = ["./src/Api.ts"];

export async function prod(): Promise<any> {
  return bundle(true);
}

export async function dev(): Promise<any> {
  return bundle(false);
}

function bundle(production: boolean): Promise<void> {
  const outdir = destDirectory(production);
  const promisedResult = esbuild({
    entryPoints,
    outdir,
    bundle: true,
    sourcemap: !production,
    minify: production,
    splitting: true,
    format: "esm",
    target: "es2019",
    define: {
      "process.env.NODE_ENV": production ? '"production"' : '"development"',
    },
  }).then(() => {
    console.log("Built esbuild to " + outdir);
  });
  return promisedResult;
}

function destDirectory(production: boolean): string {
  return production ? productionOutDir : devOutDir;
}

async function runCmd() {
  const cmd = (process.argv[2] || defaultCmd).toLowerCase();
  if (cmd === "--tasks") {
    console.log(`tasks: ${Object.keys(exports).join("\n       ")}`);
    return 0;
  } else {
    const foundKey = Object.keys(exports).find(
      (key: string) => key.toLowerCase() === cmd
    );
    if (foundKey) {
      exports[foundKey]();
    } else {
      console.error(`build command: "${cmd}" not found`);
      return 1;
    }
  }
}

// must come after exports, so that the exported functions for commands are in module.exports
runCmd().then(() => 0);
