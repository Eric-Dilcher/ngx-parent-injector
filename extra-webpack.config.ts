import { join } from 'path';
import {
  CustomWebpackBrowserSchema,
  TargetOptions,
} from '@angular-builders/custom-webpack';
import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

export default (
  config: webpack.Configuration,
  _options: CustomWebpackBrowserSchema,
  _targetOptions: TargetOptions
) => {
  config.entry = {
    ...(config.entry as object),
    childWindow: join(__dirname, './src/childWindow.ts'),
    // additional child window entry points
  };
  (config.plugins ??= []).push(
    new HtmlWebpackPlugin({
      template: './src/childWindow.html',
      filename: 'childWindow.html',
      chunks: ['vendor', 'polyfills', 'styles', 'childWindow'],
      inject: "body",
      scriptLoading: "module"
    })
    // Additional child window root html files. Be sure to update `chunks`
    // to include the appropriate JS file from the `entry` section above.
  );

  // Ignoring TS error because in this angular build, we know that splitChunks.cacheGroups is defined.
  // @ts-ignore
  config.optimization.splitChunks.cacheGroups = {
    // @ts-ignore
    ...config.optimization.splitChunks.cacheGroups,
    // force node modules to be shared between parent and child windows.
    // This is needed to prevent including Angular framework in multiple chunks.
    vendor: {
      chunks: 'initial',
      name: 'vendor',
      test: /[\\/]node_modules[\\/]/,
      minChunks: 2,
    },
  };
  return config;
};
