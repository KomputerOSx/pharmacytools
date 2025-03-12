import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
];

const ignores = {
    paths: [
        "src/firebase/uploadToFirestore.js",
        "src/TextAnimations/ScrollVelocity/ScrollVelocity.tsx",
    ],
};

export default eslintConfig;
