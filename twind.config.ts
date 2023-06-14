import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  variants: {
    'input-has-value': "&:not(:has(:placeholder-shown)) > div:first-child",
  }
} as Options;
