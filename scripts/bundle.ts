import { build } from "esbuild";
import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";

await build({
  entryPoints: ["src/index.tsx"],
  bundle: true,
  sourcemap: true,
  outfile: "public/__build/bundle.js",
  watch: process.argv.includes("--watch"),
  plugins: [vanillaExtractPlugin()],
});
