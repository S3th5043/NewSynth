export const cx = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');
