import React, { useState, useEffect, useRef, useContext } from "react";
import { ColorActionType, ColorType } from "@/lib/types";
import { RootColorPalette } from "../StudyPane/InfoPane/Motif/Root";
import { DEFAULT_COLOR_FILL, DEFAULT_TEXT_COLOR, FormatContext } from '../StudyPane/index';
import { updateWordColor } from "@/lib/actions";
import { HebWordProps } from "../StudyPane/InfoPane/Motif/Root";

interface SmartHighlightProps {
    rootWords: HebWordProps[]; // Property with a type of an empty array
}

const SmartHighlight: React.FC<SmartHighlightProps> = ({rootWords}) => {

  const { ctxStudyId, ctxSetRootsColorMap } = useContext(FormatContext);

  const [modalOpen, setModalOpen] = useState(false);

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modal.current) return;
      if (
        !modalOpen ||
        modal.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  
  const handleClick = () => {

    let newMap = new Map<number, ColorType>();

    rootWords.forEach((rootWord, index) => {
        let descendantWordIds: number[] = [];
        rootWord.descendants.forEach((word) => {
            descendantWordIds.push(word.id)
        });

        let rootBlockColor: ColorType = {
            colorFill: (index < RootColorPalette.length) ? RootColorPalette[index] : DEFAULT_COLOR_FILL,
            textColor: (index < 10) ? '#000000' : (index < 20 || index >= RootColorPalette.length) ? DEFAULT_TEXT_COLOR : '#FFFFFF',
            borderColor: "" // not used for root block
        };

        updateWordColor(ctxStudyId, descendantWordIds, ColorActionType.colorFill, rootBlockColor.colorFill);
        updateWordColor(ctxStudyId, descendantWordIds, ColorActionType.textColor, rootBlockColor.textColor);
        newMap.set(rootWord.descendants[0].strongNumber, rootBlockColor);
    })
    ctxSetRootsColorMap(newMap);
    setModalOpen(false);
    
}

  
  return (
    <>

      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      >
        Smart Highlight
      </button>

      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          onBlur={() => setModalOpen(false)}
          className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15"
        >
          <span className="mx-auto inline-block">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                opacity="0.1"
                width="60"
                height="60"
                rx="30"
                fill="#DC2626"
              />
              <path
                d="M30 27.2498V29.9998V27.2498ZM30 35.4999H30.0134H30ZM20.6914 41H39.3086C41.3778 41 42.6704 38.7078 41.6358 36.8749L32.3272 20.3747C31.2926 18.5418 28.7074 18.5418 27.6728 20.3747L18.3642 36.8749C17.3296 38.7078 18.6222 41 20.6914 41Z"
                stroke="#DC2626"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="mt-5.5 pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Confirm Smart Highlight
          </h3>          
          <p className="mb-10">
            Using smart highlight will overwrite your custom styles on identical words.
          </p>
          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="w-full px-3 2xsm:w-1/2">
              <button
                onClick={() => setModalOpen(false)}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                Cancel
              </button>
            </div>
            <div className="w-full px-3 2xsm:w-1/2">
              <button 
                className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                onClick={() => handleClick()}
               >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default SmartHighlight;
