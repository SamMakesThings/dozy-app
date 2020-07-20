/* eslint-disable import/prefer-default-export */
import React from 'react';
import { WebView } from 'react-native-webview';
import treatments from '../constants/Treatments';

// Display a webview of the relevant knowledgebase collection or page
export const TreatmentReviewScreen = ({ route }) => {
  return (
    <WebView
      source={{
        // Get the module from nav params & URL from treatment constants
        uri: treatments[route.params.module].url
      }}
    />
  );
};
