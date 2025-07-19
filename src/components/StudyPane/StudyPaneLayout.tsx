import React from 'react';
import Header from "./Header";
import Passage from "./Passage";
import CloneStudyModal from '../Modals/CloneStudy';
import InfoPane from "./InfoPane";
import { Footer } from "./Footer";
import { InfoPaneActionType } from "@/lib/types";

interface StudyPaneLayoutProps {
  passageData: any;
  isHebrew: boolean;
  infoPaneAction: any;
  setInfoPaneAction: (action: any) => void;
  setHebrew: (isHebrew: boolean) => void;
  setScaleValue: (value: number) => void;
  setColorAction: (action: any) => void;
  setSelectedColor: (color: string) => void;
  setBoxDisplayStyle: (style: any) => void;
  cloneStudyOpen: boolean;
  setCloneStudyOpen: (open: boolean) => void;
}

/**
 * Layout component for StudyPane - handles the visual structure
 */
export const StudyPaneLayout: React.FC<StudyPaneLayoutProps> = ({
  passageData,
  isHebrew,
  infoPaneAction,
  setInfoPaneAction,
  setHebrew,
  setScaleValue,
  setColorAction,
  setSelectedColor,
  setBoxDisplayStyle,
  cloneStudyOpen,
  setCloneStudyOpen
}) => {
  return (
    <>
      {/* Header */}
      <Header
        study={passageData.study}
        setLangToHebrew={setHebrew}
        setInfoPaneAction={setInfoPaneAction}
        infoPaneAction={infoPaneAction}
        setScaleValue={setScaleValue}
        setColorAction={setColorAction}
        setSelectedColor={setSelectedColor}
        setBoxStyle={setBoxDisplayStyle}
        setCloneStudyOpen={setCloneStudyOpen}        
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pt-32">
        <main className={`flex-1 overflow-y-auto relative h-full ${isHebrew ? "hbFont" : ""} w-full ${infoPaneAction !== InfoPaneActionType.none ? 'max-w-3/4' : ''}`}>
          {/* Scrollable Passage Pane */}
          <Passage bibleData={passageData.bibleData} />
          <CloneStudyModal 
            originalStudy={passageData.study} 
            open={cloneStudyOpen} 
            setOpen={setCloneStudyOpen} 
          />
        </main>

        {infoPaneAction !== InfoPaneActionType.none && (
          /* Scrollable Info Pane */
          <InfoPane
            infoPaneAction={infoPaneAction}
            setInfoPaneAction={setInfoPaneAction}
          />
        )}
      </div>

      {/* Footer */}
      <Footer/>
    </>
  );
};
