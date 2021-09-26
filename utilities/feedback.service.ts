import React, { useState, useContext, createContext, useMemo } from 'react';

export interface FeedbackContextValue {
  showingFeedbackWidget: boolean;
  setShowingFeedbackWidget: (showing: boolean) => void;
  isFeedbackSubmitted: boolean;
  setFeedbackSubmitted: (submitted: boolean) => void;
}

class Feedback {
  static Context = createContext<FeedbackContextValue | null>(null);

  static useFeedbackService(): FeedbackContextValue {
    const [showingFeedbackWidget, setShowingFeedbackWidget] = useState(false);
    const [isFeedbackSubmitted, setFeedbackSubmitted] = useState(false);

    const contextValue = useMemo(
      () => ({
        showingFeedbackWidget,
        setShowingFeedbackWidget,
        isFeedbackSubmitted,
        setFeedbackSubmitted,
      }),
      [showingFeedbackWidget, isFeedbackSubmitted],
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
