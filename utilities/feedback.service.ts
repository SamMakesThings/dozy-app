import React, { useState, useContext, createContext, useMemo } from 'react';

export interface FeedbackContextValue {
  showingFeedbackPopup: boolean;
  setShowingFeedbackPopup: (showing: boolean) => void;
  showingFeedbackWidget: boolean;
  setShowingFeedbackWidget: (showing: boolean) => void;
}

class Feedback {
  static Context = createContext<FeedbackContextValue | null>(null);

  static useFeedbackService(): FeedbackContextValue {
    const [showingFeedbackPopup, setShowingFeedbackPopup] = useState(false);
    const [showingFeedbackWidget, setShowingFeedbackWidget] = useState(true);

    const contextValue = useMemo(
      () => ({
        showingFeedbackPopup,
        setShowingFeedbackPopup,
        showingFeedbackWidget,
        setShowingFeedbackWidget,
      }),
      [showingFeedbackPopup, showingFeedbackWidget],
    );

    return contextValue;
  }

  static useFeedback(): FeedbackContextValue {
    return useContext<FeedbackContextValue>(
      Feedback.Context as React.Context<FeedbackContextValue>,
    );
  }
}

export default Feedback;
