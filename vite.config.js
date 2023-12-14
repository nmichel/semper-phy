import { resolve } from 'path';

export default {
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
        shooter: resolve(__dirname, './shooter/index.html'),
      },
    },
  },
};
