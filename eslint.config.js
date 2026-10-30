import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({ ignores: ['build/', 'jsnext/'] }, tseslint.configs.recommended);
