"use client";

import { useContext, useEffect, useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { getXataClient } from "@/xata";
import DiscoveryModal from "@/components/Modals/Footer/DiscoveryModal";
import StepBibleModal from "@/components/Modals/Footer/StepBibleModal";
import BSBModal from "@/components/Modals/Footer/BSBModal";
import ESVModal from "@/components/Modals/Footer/ESVModal";
import OHBModal from "@/components/Modals/Footer/OHBModal";
import WordAnalysisModal, { WordAnalysisInfo } from "@/components/Modals/WordAnalysis";
import { FormatContext } from ".";

type WordInfo = WordAnalysisInfo & { morphology: string };

const WordInfoBar = () => {
  const { ctxSelectedWords } = useContext(FormatContext);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [info, setInfo] = useState<WordInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async (word: string) => {
      const xata = getXataClient();
      const tbesh = await xata.db.stepbible_tbesh.filter({ Hebrew: word }).getFirst();
      const heb = await xata.db.heb_bible.filter({ hebUnicode: word }).getFirst();
      if (!tbesh && !heb) return null;
      return {
        hebrew: tbesh?.Hebrew || heb?.hebUnicode || word,
        transliteration: tbesh?.Transliteration || "",
        gloss: tbesh?.Gloss || "",
        strong: tbesh?.uStrong || tbesh?.dStrong || tbesh?.eStrong || "",
        morphology: heb?.morphology || tbesh?.Morph || "",
        meaning: tbesh?.Meaning || "",
      } as WordInfo;
    };

    if (ctxSelectedWords.length > 0) {
      fetchInfo(ctxSelectedWords[0].wlcWord).then((data) => {
        setInfo(data);
      });
    } else {
      setInfo(null);
    }
  }, [ctxSelectedWords]);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t-2 border-gray-300 bg-gray-100 px-4 py-2 text-sm dark:border-gray-700 dark:bg-boxdark">
        <div className="flex items-center gap-2">
          <span className="font-medium">Word Information</span>
          <button onClick={() => setExpanded(!expanded)}>
            <IconInfoCircle size={18} />
          </button>
          {expanded && (
            <div className="ml-4 flex items-center gap-4">
              {info ? (
                <>
                  <span>
                    {info.hebrew} ({info.transliteration}) {info.gloss}
                  </span>
                  <span>Morphology: {info.morphology}</span>
                  <button onClick={() => setModalOpen(true)}>
                    <IconInfoCircle size={16} />
                  </button>
                </>
              ) : (
                <span>Select a word</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div>Copyright Information for&nbsp;</div>
          <DiscoveryModal />,&nbsp;
          <StepBibleModal />,&nbsp;
          <BSBModal />,&nbsp;
          <ESVModal />,&nbsp;
          <OHBModal />
        </div>
      </div>
      {info && (
        <WordAnalysisModal open={modalOpen} setOpen={setModalOpen} info={info} />
      )}
    </>
  );
};

export default WordInfoBar;
