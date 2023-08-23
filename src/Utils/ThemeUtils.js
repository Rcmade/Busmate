import {useAppFeature} from '../Context/AppFeatureContext';

// Utility function to get theme-specific color
export const getThemedColor = (colorLight, colorDark) => {
  const {appFeatureState} = useAppFeature();
  const {theme} = appFeatureState;

  return theme === 'light' ? colorLight : colorDark;
};
