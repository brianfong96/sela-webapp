import { useEffect, useContext } from 'react';
import { FormatContext } from '../components/StudyPane';
import { WordProps } from '@/lib/data';
import { StructureUpdateType } from '@/lib/types';
import { mergeData } from '@/lib/utils';
import { updateMetadataInDb } from '@/lib/actions';

const useStructureUpdate = (bibleData: WordProps[]) => {
  const {
    ctxStudyId,
    ctxPassageProps,
    ctxSetPassageProps,
    ctxStudyMetadata,
    ctxSetStudyMetadata,
    ctxSelectedWords,
    ctxSetSelectedWords,
    ctxSetNumSelectedWords,
    ctxSelectedStrophes,
    ctxSetSelectedStrophes,
    ctxSetNumSelectedStrophes,
    ctxStructureUpdateType,
    ctxSetStructureUpdateType,
    ctxAddToHistory,
  } = useContext(FormatContext);

  useEffect(() => {
    if (
      ctxStructureUpdateType !== StructureUpdateType.none &&
      (ctxSelectedWords.length > 0 || ctxSelectedStrophes.length >= 1)
    ) {
      const newMetadata = structuredClone(ctxStudyMetadata);

      const sortedWords = [...ctxSelectedWords].sort((a, b) => a.wordId - b.wordId);
      let selectedWordId = sortedWords.length > 0 ? sortedWords[0].wordId : 0;
      const lastSelectedWordId =
        sortedWords.length > 0 ? sortedWords[sortedWords.length - 1].wordId : selectedWordId;

      if (ctxStructureUpdateType == StructureUpdateType.newLine) {
        newMetadata.words[selectedWordId] = {
          ...(newMetadata.words[selectedWordId] || {}),
          lineBreak: true,
          ignoreNewLine: undefined,
        };

        sortedWords.slice(1).forEach((w) => {
          const hasBreak = w.newLine || newMetadata.words[w.wordId]?.lineBreak;
          if (hasBreak) {
            newMetadata.words[w.wordId] = {
              ...(newMetadata.words[w.wordId] || {}),
              lineBreak: undefined,
              ignoreNewLine: true,
            };
          } else if (newMetadata.words[w.wordId]) {
            delete newMetadata.words[w.wordId].lineBreak;
            delete newMetadata.words[w.wordId].ignoreNewLine;
          }
        });

        const nextWordId = lastSelectedWordId + 1;
        if (bibleData.some((word) => word.wordId === nextWordId)) {
          newMetadata.words[nextWordId] = {
            ...(newMetadata.words[nextWordId] || {}),
            lineBreak: true,
            ignoreNewLine: undefined,
          };
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.mergeWithPrevLine) {
        const foundIndex = bibleData.findLastIndex(
          (word) =>
            word.wordId <= selectedWordId &&
            (word.newLine || newMetadata.words[word.wordId]?.lineBreak)
        );
        if (foundIndex !== -1) {
          const id = bibleData[foundIndex].wordId;
          newMetadata.words[id] = {
            ...(newMetadata.words[id] || {}),
            lineBreak: undefined,
            ignoreNewLine: true,
          };
        }

        for (let i = selectedWordId; i <= lastSelectedWordId; i++) {
          const word = bibleData.find((w) => w.wordId === i);
          if (word?.newLine || newMetadata.words[i]?.lineBreak) {
            newMetadata.words[i] = {
              ...(newMetadata.words[i] || {}),
              lineBreak: undefined,
              ignoreNewLine: true,
            };
          }
        }

        const nextWordId = lastSelectedWordId + 1;
        if (bibleData.some((word) => word.wordId === nextWordId)) {
          newMetadata.words[nextWordId] = {
            ...(newMetadata.words[nextWordId] || {}),
            lineBreak: true,
            ignoreNewLine: undefined,
          };
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.mergeWithNextLine) {
        newMetadata.words[selectedWordId] = {
          ...(newMetadata.words[selectedWordId] || {}),
          lineBreak: true,
          ignoreNewLine: undefined,
        };

        sortedWords.slice(1).forEach((w) => {
          if (w.newLine || newMetadata.words[w.wordId]?.lineBreak) {
            newMetadata.words[w.wordId] = {
              ...(newMetadata.words[w.wordId] || {}),
              lineBreak: undefined,
              ignoreNewLine: true,
            };
          }
        });

        const foundIndex = bibleData.findIndex(
          (word) =>
            word.wordId > lastSelectedWordId &&
            (word.newLine || newMetadata.words[word.wordId]?.lineBreak)
        );
        if (foundIndex !== -1) {
          const id = bibleData[foundIndex].wordId;
          newMetadata.words[id] = {
            ...(newMetadata.words[id] || {}),
            lineBreak: undefined,
            ignoreNewLine: true,
          };
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.newStrophe) {
        newMetadata.words[selectedWordId] = {
          ...newMetadata.words[selectedWordId],
          stropheDiv: true,
        };

        sortedWords.slice(1).forEach((w) => {
          if (newMetadata.words[w.wordId]) {
            delete newMetadata.words[w.wordId].stropheDiv;
            delete newMetadata.words[w.wordId].stropheMd;
          }
        });

        const nextWordId = lastSelectedWordId + 1;
        if (bibleData.some((word) => word.wordId === nextWordId)) {
          newMetadata.words[nextWordId] = {
            ...(newMetadata.words[nextWordId] || {}),
            stropheDiv: true,
          };
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.mergeWithPrevStrophe) {
        if (ctxSelectedStrophes.length >= 1) {
          const sortedStrophes = [...ctxSelectedStrophes].sort((a, b) => a.stropheId - b.stropheId);
          sortedStrophes.forEach((s) => {
            const firstWordId = s.lines[0].words[0].wordId;
            delete newMetadata.words[firstWordId]?.stropheDiv;
            delete newMetadata.words[firstWordId]?.stropheMd;
          });
          const lastWordId = sortedStrophes.at(-1)!.lines.at(-1)!.words.at(-1)!.wordId;
          const nextWordId = lastWordId + 1;
          newMetadata.words[nextWordId] = {
            ...(newMetadata.words[nextWordId] || {}),
            stropheDiv: true,
          };
        } else {
          const foundIndex = bibleData.findLastIndex(
            (word) => word.wordId <= selectedWordId && newMetadata.words[word.wordId]?.stropheDiv
          );
          if (foundIndex !== -1) {
            delete newMetadata.words[bibleData[foundIndex].wordId].stropheDiv;
            delete newMetadata.words[bibleData[foundIndex].wordId].stropheMd;
          }

          for (let i = selectedWordId; i <= lastSelectedWordId; i++) {
            if (newMetadata.words[i]) {
              delete newMetadata.words[i].stropheDiv;
              delete newMetadata.words[i].stropheMd;
            }
          }

          const nextWordId = lastSelectedWordId + 1;
          newMetadata.words[nextWordId] = {
            ...(newMetadata.words[nextWordId] || {}),
            stropheDiv: true,
          };
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.mergeWithNextStrophe) {
        if (ctxSelectedStrophes.length >= 1) {
          const sortedStrophes = [...ctxSelectedStrophes].sort((a, b) => a.stropheId - b.stropheId);
          const firstWordId = sortedStrophes[0].lines[0].words[0].wordId;
          newMetadata.words[firstWordId] = {
            ...(newMetadata.words[firstWordId] || {}),
            stropheDiv: true,
          };
          const foundIndex = bibleData.findIndex(
            (word) =>
              word.wordId > sortedStrophes.at(-1)!.lines.at(-1)!.words.at(-1)!.wordId &&
              newMetadata.words[word.wordId]?.stropheDiv
          );
          if (foundIndex !== -1) {
            newMetadata.words[bibleData[foundIndex].wordId] = {
              ...newMetadata.words[bibleData[foundIndex].wordId],
              stropheDiv: false,
              stropheMd: undefined,
            };
          }
        } else {
          newMetadata.words[selectedWordId] = {
            ...(newMetadata.words[selectedWordId] || {}),
            stropheDiv: true,
          };

          for (let i = selectedWordId + 1; i <= lastSelectedWordId; i++) {
            if (newMetadata.words[i]) {
              delete newMetadata.words[i].stropheDiv;
              delete newMetadata.words[i].stropheMd;
            }
          }

          const foundIndex = bibleData.findIndex(
            (word) => word.wordId > lastSelectedWordId && newMetadata.words[word.wordId]?.stropheDiv
          );
          if (foundIndex !== -1) {
            newMetadata.words[bibleData[foundIndex].wordId] = {
              ...newMetadata.words[bibleData[foundIndex].wordId],
              stropheDiv: false,
              stropheMd: undefined,
            };
          }
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.newStanza) {
        const sortedStrophes = [...ctxSelectedStrophes].sort(
          (a, b) => a.lines[0].words[0].wordId - b.lines[0].words[0].wordId
        );
        if (sortedStrophes.length === 0) {
          return;
        }

        const firstWordId = sortedStrophes[0].lines[0].words[0].wordId;
        const lastStrophe = sortedStrophes[sortedStrophes.length - 1];
        const lastWordIdInStrophes =
          lastStrophe.lines.at(-1)?.words.at(-1)?.wordId || firstWordId;

        sortedStrophes.forEach((s) => {
          const wordId = s.lines[0].words[0].wordId;
          if (newMetadata.words[wordId]) {
            delete newMetadata.words[wordId].stanzaDiv;
            delete newMetadata.words[wordId].stanzaMd;
          }
        });

        newMetadata.words[firstWordId] = {
          ...newMetadata.words[firstWordId],
          stanzaDiv: true,
        };

        const nextWordId = lastWordIdInStrophes + 1;
        if (bibleData.some((word) => word.wordId === nextWordId)) {
          newMetadata.words[nextWordId] = {
            ...(newMetadata.words[nextWordId] || {}),
            stanzaDiv: true,
          };
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.mergeWithPrevStanza) {
        const sortedStrophes = [...ctxSelectedStrophes].sort(
          (a, b) => a.lines[0].words[0].wordId - b.lines[0].words[0].wordId
        );
        if (sortedStrophes.length === 0) {
          return;
        }

        const firstWordId = sortedStrophes[0].lines[0].words[0].wordId;
        const lastStrophe = sortedStrophes[sortedStrophes.length - 1];
        const lastWordId = lastStrophe.lines.at(-1)?.words.at(-1)?.wordId || firstWordId;

        const lastStanzaDiv = bibleData.findLastIndex(
          (word) => word.wordId <= firstWordId && newMetadata.words[word.wordId]?.stanzaDiv
        );
        if (lastStanzaDiv >= 0) {
          delete newMetadata.words[bibleData[lastStanzaDiv].wordId].stanzaDiv;
          delete newMetadata.words[bibleData[lastStanzaDiv].wordId].stanzaMd;
        }

        const foundIndex = bibleData.findIndex(
          (word) => word.wordId > lastWordId && newMetadata.words[word.wordId]?.stropheDiv
        );
        if (foundIndex !== -1) {
          newMetadata.words[bibleData[foundIndex].wordId] = {
            ...newMetadata.words[bibleData[foundIndex].wordId],
            stanzaDiv: true,
          };
        }
      } else if (ctxStructureUpdateType == StructureUpdateType.mergeWithNextStanza) {
        const sortedStrophes = [...ctxSelectedStrophes].sort(
          (a, b) => a.lines[0].words[0].wordId - b.lines[0].words[0].wordId
        );
        if (sortedStrophes.length === 0) {
          return;
        }

        const firstWordId = sortedStrophes[0].lines[0].words[0].wordId;
        const lastStrophe = sortedStrophes[sortedStrophes.length - 1];
        const lastWordId = lastStrophe.lines.at(-1)?.words.at(-1)?.wordId || firstWordId;

        newMetadata.words[firstWordId] = {
          ...(newMetadata.words[firstWordId] || {}),
          stanzaDiv: true,
        };
        const foundIndex = bibleData.findIndex(
          (word) =>
            word.wordId > lastWordId &&
            newMetadata.words[word.wordId]?.stanzaDiv &&
            newMetadata.words[word.wordId]?.stropheDiv
        );
        if (foundIndex !== -1) {
          newMetadata.words[bibleData[foundIndex].wordId] = {
            ...newMetadata.words[bibleData[foundIndex].wordId],
            stanzaDiv: false,
            stanzaMd: undefined,
          };
        }
      }

      ctxSetStudyMetadata(newMetadata);
      ctxAddToHistory(newMetadata);
      const updatedPassageProps = mergeData(bibleData, newMetadata);
      ctxSetPassageProps(updatedPassageProps);

      updateMetadataInDb(ctxStudyId, newMetadata);

      ctxSetSelectedStrophes([]);
      ctxSetNumSelectedStrophes(0);
    }

    ctxSetStructureUpdateType(StructureUpdateType.none);
  }, [ctxStructureUpdateType, ctxSelectedWords, ctxSetNumSelectedWords, ctxSetSelectedWords, ctxSetStructureUpdateType]);
};

export default useStructureUpdate;
