import { Options } from "$fresh/plugins/twind.ts";
import { apply } from "twind";

export default {
  selfURL: import.meta.url,
  variants: {
    'input-has-value': "&:not(:has(:placeholder-shown)) > div:first-child",
  },
  theme: {
    fontFamily: {
      cursive: ['Changa One', 'cursive'],
      sus: ['VT323', 'monospace'],
    },
  },
  preflight: {
    ':global': {
      'main': {
        'h1, h2, h3, h4, h5, h6, p': apply('mb-4 max-w-screen-md'),
        'a': apply('text-red-700 hover:(text-red-500) underline'),
      },
      'h1': apply('text-4xl'),
      'h2': apply('text-3xl'),
      'h3, h4, h5, h6': apply('text-2xl'),
      '.site-title': apply('font-cursive'),

    }
  }
} as Options;
