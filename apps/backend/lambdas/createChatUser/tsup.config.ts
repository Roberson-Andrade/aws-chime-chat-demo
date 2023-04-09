import { builtinModules } from 'module';
import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'node18',
  entryPoints: ['index.ts'],
  external: [
    ...builtinModules,
    '@aws-sdk/client-chime-sdk-messaging',
    '@aws-sdk/client-chime-sdk-identity',
    'aws-lambda',
  ],
  format: ['cjs', 'esm'],
  outDir: 'dist',
});
