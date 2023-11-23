import babel from "@rollup/plugin-babel"
import external from "rollup-plugin-peer-deps-external"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript" // For Typescript
import postcss from "rollup-plugin-postcss-modules"
import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"

import autoprefixer from "autoprefixer"

const config = [
  {
    input: "./index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.es.js",
        format: "es",
        exports: "named",
      },
    ],
    external: ["phone"],
    plugins: [
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      external({
        includeDependencies: true,
      }),
      commonjs(),
      nodeResolve(),
      terser(),
      postcss({
        extract: true, // extracts to `${basename(dest)}.css`
        plugins: [autoprefixer()],
        // writeDefinitions: true,
      }),
      typescript({ sourceMap: true }),
    ],
  },
]

export default config
