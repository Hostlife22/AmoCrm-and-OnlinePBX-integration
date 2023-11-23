import babel from "@rollup/plugin-babel"
import external from "rollup-plugin-peer-deps-external"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript" // For Typescript
import postcss from "rollup-plugin-postcss-modules"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import jsonParse from "@rollup/plugin-json"

import autoprefixer from "autoprefixer"

const config = [
  {
    input: "./index.ts",
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: true,
    },
    external: ["phone", "axios", "react", "react-dom"],
    plugins: [
      nodeResolve({ browser: true }),
      commonjs({
        compact: true,
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      typescript({ tsconfig: "./tsconfig.json", declaration: true, declarationDir: "dist" }),
      postcss({
        extract: true, // extracts to `${basename(dest)}.css`
        plugins: [autoprefixer()],
        // writeDefinitions: true,
      }),
      external({
        includeDependencies: true,
      }),
      jsonParse(),
      terser(),
    ],
  },
]

export default config
