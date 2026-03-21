/// <reference types="vitest/config" />
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';
import {fileURLToPath, URL} from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    plugins: [
        vue(),
        dts({
            outDir: ['es', 'lib'],
            tsconfigPath: './tsconfig.app.json',
        }),
    ],

    build: {
        emptyOutDir: true,
        rolldownOptions: {
            external: ['vue'],
            input: resolve(__dirname, 'src/index.ts'),

            output: [
                {
                    format: 'es',
                    entryFileNames: '[name].js',
                    //配置打包根目录
                    dir: 'es',
                },
                {
                    //打包格式
                    format: 'cjs',
                    //打包后文件名
                    entryFileNames: '[name].js',
                    //配置打包根目录
                    dir: 'lib',
                },
            ],
        },
        lib: {
            entry: './index.ts',
            name: '@potmot/list',
            fileName: 'index',
        },
    },

    test: {
        globals: false,
        environment: 'jsdom',
        coverage: {
            enabled: true,
            provider: 'v8',
            cleanOnRerun: true,
        },
    },
});
