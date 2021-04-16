import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

// Define default chart styles
export const chartStyles = {
  chart: {
    width: scale(335),
    height: scale(220),
    domainPadding: { x: 3, y: 35 }
  },
  axis: {
    tickLabels: {
      angle: -45,
      fontSize: scale(11),
      fill: dozy_theme.colors.light
    },
    grid: {
      stroke: dozy_theme.colors.medium
    }
  },
  line: {
    data: {
      stroke: dozy_theme.colors.primary,
      strokeWidth: scale(4),
      strokeLinejoin: 'round'
    }
  },
  scatter: {
    data: {
      fill: dozy_theme.colors.primary
    }
  }
};
