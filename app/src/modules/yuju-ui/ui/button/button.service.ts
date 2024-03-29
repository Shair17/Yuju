import color from 'color';

export const getUnderlayColor = (theme: ThemeType, props: ButtonProps) => {
  return getThemeColor(
    theme.colors,
    props.underlayColor
      ? props.underlayColor
      : color(getThemeColor(theme.colors, props.bg)).darken(0.1).rgb().string(),
  );
};

export const getRippleColor = (color: string, disabled: boolean = false) => {
  return color(getThemeColor(theme.colors, props.rippleColor))
    .alpha(disabled ? 0 : 0.2)
    .rgb()
    .string();
};
