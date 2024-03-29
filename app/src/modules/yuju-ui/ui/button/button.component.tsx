import React from 'react';
import {
  View as RNView,
  ActivityIndicator as RNActivityIndicator,
  type TextProps,
  type PressableProps,
} from 'react-native';
import {Pressable as RNButton, ColorPath, useDripsyTheme} from 'dripsy';

// import {getThemeProperty, getThemeColor} from '../../theme/theme.service';
import {getUnderlayColor, getRippleColor} from './button.service';

import {Text} from '../text/text.component';

interface ButtonProps extends PressableProps {
  bg: ColorPath;
  color: ColorPath;
  loading?: boolean;
  disabled?: boolean;
  textProps?: TextProps;
}

const Button: React.FC<ButtonProps> = props => {
  const {theme} = useDripsyTheme();
  const {
    children,
    color,
    bg,
    loading = false,
    disabled = false,
    onPress,
    textProps,
    ...rest
  } = props;
  // const underlayColor = getUnderlayColor(theme, props);
  // const calculatedRippleColor = getRippleColor(theme, props);

  const renderChildren = () => {
    if (typeof children === 'string') {
      return (
        <Text
          {...textProps}
          // {...getSpecificProps(props, ...textProps)}
          //style={computedStyle.text}
        >
          {children}
        </Text>
      );
    }

    return children;
  };

  return (
    <RNButton
      {...rest}
      onPress={disabled || loading ? undefined : onPress}
      // style={({pressed}) => [
      // computedStyle.button,
      //pressed && !disabled && !loading && {backgroundColor: underlayColor},
      // ]}
    >
      {loading ? (
        <RNView>
          <RNView>
            <RNActivityIndicator
            // size={getThemeProperty(theme.fontSize, loaderSize)}
            // color={getThemeColor(theme.colors, loaderColor)}
            />
          </RNView>
        </RNView>
      ) : (
        <RNView>
          <>
            {/* {prefix} */}
            {renderChildren()}
            {/* {suffix} */}
          </>
        </RNView>
      )}
    </RNButton>
  );
};

export {Button};
