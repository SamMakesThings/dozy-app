import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ImageSourcePropType,
  TouchableOpacity,
  GestureResponderEvent
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { dozy_theme } from '../config/Themes';

interface Props {
  style: object;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  bgImage: ImageSourcePropType;
  overlayColor?: string;
  titleLabel: string;
  subtitleLabel: string;
}

export const LinkCard: React.FC<Props> = (props) => {
  const theme = dozy_theme;
  return (
    <View style={{ ...props.style, ...styles.View_ContentLinkCard }}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <ImageBackground
          source={props.bgImage}
          style={styles.Image_ContentLinkBackground}
        >
          <View
            style={{
              ...styles.View_CardLinkImageOverlay,
              backgroundColor: props.overlayColor || 'rgba(64, 75, 105, 0.8)'
            }}
          >
            <View style={{ maxWidth: '90%' }}>
              <Text
                style={{
                  ...theme.typography.body1,
                  ...styles.Text_ContentLinkTitle,
                  opacity: props.disabled ? 0.5 : 1
                }}
              >
                {props.titleLabel}
              </Text>
              <Text
                style={{
                  ...theme.typography.body1,
                  ...styles.Text_ContentLinkSubtitle
                }}
              >
                {props.subtitleLabel}
              </Text>
            </View>
            <Entypo
              name={'chevron-right'}
              size={scale(25)}
              color={theme.colors.secondary}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  View_ContentLinkCard: {
    height: scale(80),
    flex: 1,
    borderRadius: dozy_theme.borderRadius.global,
    overflow: 'hidden'
  },
  View_CardLinkImageOverlay: {
    flex: 1,
    padding: scale(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Image_ContentLinkBackground: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  Text_ContentLinkTitle: {
    fontSize: scale(15),
    fontFamily: 'RubikMedium',
    color: dozy_theme.colors.secondary,
    lineHeight: scale(15)
  },
  Text_ContentLinkSubtitle: {
    fontSize: scale(15),
    color: dozy_theme.colors.secondary,
    opacity: 0.6,
    lineHeight: scale(14)
  }
});

export default LinkCard;
