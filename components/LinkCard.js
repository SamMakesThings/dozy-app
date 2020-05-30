import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { slumber_theme } from '../config/Themes';

export const LinkCard = (props) => {
  const theme = slumber_theme;
  return (
    <View style={{ ...props.style, ...styles.View_ContentLinkCard }}>
      <TouchableOpacity style={{ flex: 1 }} onPress={props.onPress}>
        <ImageBackground
          source={props.bgImage}
          style={styles.Image_ContentLinkBackground}
        >
          <View style={styles.View_CardLinkImageOverlay}>
            <View style={{ maxWidth: '90%' }}>
              <Text
                style={{
                  ...theme.typography.body1,
                  ...styles.Text_ContentLinkTitle
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
    borderRadius: slumber_theme.borderRadius.global,
    overflow: 'hidden'
  },
  View_CardLinkImageOverlay: {
    backgroundColor: 'rgba(64, 75, 105, 0.8)',
    width: '100%',
    height: '100%',
    padding: scale(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Image_ContentLinkBackground: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  Text_ContentLinkTitle: {
    fontSize: scale(15),
    fontFamily: 'RubikMedium',
    color: slumber_theme.colors.secondary
  },
  Text_ContentLinkSubtitle: {
    fontSize: scale(15),
    color: slumber_theme.colors.secondary,
    opacity: 0.6,
    lineHeight: scale(14)
  }
});

export default withTheme(LinkCard);
