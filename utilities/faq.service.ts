import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { FAQData } from '../types/faq';

export interface FAQContextValue {
  faqs: FAQData[];
  setFAQAsRead: (faqId: string) => Promise<void>;
}

class FAQ {
  static Context = createContext<FAQContextValue | null>(null);

  static useFAQService(): FAQContextValue {
    const [faqs, setFAQs] = useState<FAQData[]>([]);
    const [readFAQIds, setReadFAQIds] = useState<string[]>([]);

    useEffect((): void => {
      const getFAQs = async () => {
        const faqsFromDB = await FAQ.getFAQs();
        setFAQs(faqsFromDB);
      };

      getFAQs();
    }, []);

    const setFAQAsRead = useCallback(
      async (faqId: string): Promise<void> => {
        if (faqId && readFAQIds.indexOf(faqId) === -1) {
          await FAQ.increaseFAQViewCount(faqId);
          setReadFAQIds([...readFAQIds, faqId]);
        }
      },
      [readFAQIds],
    );

    const contextValue = useMemo(
      () => ({
        faqs,
        setFAQAsRead,
      }),
      [faqs, setFAQAsRead],
    );

    return contextValue;
  }

  static async getFAQs(): Promise<FAQData[]> {
    const faqs: FAQData[] = [];
    const faqsCollection = await firestore().collection('faqs').get();

    faqsCollection.forEach((doc) => {
      const data = doc.data() as FAQData;
      if (data.id && data.question) {
        faqs.push(data);
      }
    });

    return faqs;
  }

  static async increaseFAQViewCount(faqId: string): Promise<void> {
    functions().useFunctionsEmulator(
      'http://localhost:5001/slumber-app/us-central1/increaseFAQViewCount',
    );
    try {
      const response = await functions().httpsCallable('increaseFAQViewCount')({
        faqId,
      });
      console.log('increaseFAQViewCount response ************** ', response);
    } catch (error) {
      console.log('error: ', { error });
    }
  }

  static useFAQ(): FAQContextValue {
    return useContext(FAQ.Context) as FAQContextValue;
  }
}

export default FAQ;