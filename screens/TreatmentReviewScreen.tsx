/* eslint-disable import/prefer-default-export */
import React from 'react';
import { WebView } from 'react-native-webview';
import treatments from '../constants/Treatments';

interface Props {
  route: {
    params: {
      module: string;
    };
  };
}

const treatmentsIndexed: { [index: string]: { url: string } } = treatments;

// Display a webview of the relevant knowledgebase collection or page
export const TreatmentReviewScreen: React.FC<Props> = ({ route }) => {
  return (
    <WebView
      source={{
        // Get the module from nav params & URL from treatment constants
        uri: treatmentsIndexed[route.params.module].url
      }}
    />
  );
};
