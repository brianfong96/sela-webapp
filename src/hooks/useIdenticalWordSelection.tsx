import { useContext, useEffect, useMemo } from 'react';
import { FormatContext } from '../components/StudyPane';
import { eventBus } from '@/lib/eventBus';
import { extractIdenticalWordsFromPassage } from '@/lib/utils';
import { PassageProps, WordProps } from '@/lib/data';

const useIdenticalWordSelection = (passageProps: PassageProps) => {
  const { ctxSelectedWords, ctxSetSelectedWords, ctxSetNumSelectedWords } = useContext(FormatContext);

  const strongNumWordMap = useMemo(() => extractIdenticalWordsFromPassage(passageProps), [passageProps]);

  useEffect(() => {
    const handler = (word: WordProps) => {
      const identicalWords = strongNumWordMap.get(word.strongNumber);
      if (!identicalWords) return;
      const newSelectedHebWords = [...ctxSelectedWords];
      const toSelect = identicalWords.filter(w => newSelectedHebWords.indexOf(w) < 0);
      if (toSelect.length > 0) {
        toSelect.forEach(w => newSelectedHebWords.push(w));
      } else {
        identicalWords.forEach(w => newSelectedHebWords.splice(newSelectedHebWords.indexOf(w), 1));
      }
      ctxSetSelectedWords(newSelectedHebWords);
      ctxSetNumSelectedWords(newSelectedHebWords.length);
    };
    eventBus.on('selectAllIdenticalWords', handler);
    return () => eventBus.off('selectAllIdenticalWords', handler);
  }, [ctxSelectedWords, strongNumWordMap]);
};

export default useIdenticalWordSelection;
