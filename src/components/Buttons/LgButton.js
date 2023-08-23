import React from 'react';
import {Button, useTheme} from 'react-native-paper';

const LgButton = ({title, children, ...rest}) => {
  const {colors} = useTheme();

  return (
    <Button
      {...rest}
      textColor="black"
      variant="titleMedium"
      buttonColor={colors.pYellow}
      mode="contained"
      style={{paddingVertical: 4}}>
      {children}
      {title}
    </Button>
  );
};

export default LgButton;

 
