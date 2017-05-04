declare module 'validator/lib/isURL' {
  function isURL(str: string, options?: any): boolean;
  export = isURL;
}

declare module 'validator/lib/isLowercase' {
  function isLowercase(str: string): boolean;
  export = isLowercase;
}

declare module 'validator/lib/isUppercase' {
  function isUppercase(str: string): boolean;
  export = isUppercase;
}

declare module 'validator/lib/trim' {
  function trim(str: string, chars?: string | null): boolean;
  export = trim;
}

declare module 'validator/lib/ltrim' {
  function ltrim(str: string, chars?: string | null): boolean;
  export = ltrim;
}

declare module 'validator/lib/rtrim' {
  function rtrim(str: string, chars?: string | null): boolean;
  export = rtrim;
}

declare module 'validator/lib/escape' {
  function escape(str: string): string;
  export = escape;
}

declare module 'validator/lib/unescape' {
  function unescape(str: string): string;
  export = unescape;
}
