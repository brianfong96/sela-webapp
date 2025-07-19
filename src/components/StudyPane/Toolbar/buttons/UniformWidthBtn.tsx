"use client";

import { TbArrowAutofitContent, TbArrowAutofitContentFilled } from "react-icons/tb";
import { useContext } from 'react';
import { FormatContext } from '../index';
import { BoxDisplayStyle } from "@/lib/types";
import { updateMetadataInDb } from "@/lib/actions";
import ToolTip from './ToolTip';

const UniformWidthBtn = ({ setBoxStyle }: { setBoxStyle: (arg: BoxDisplayStyle) => void }) => {
  const { ctxBoxDisplayStyle, ctxInViewMode, ctxStudyId, ctxStudyMetadata, ctxSetStudyMetadata } =
    useContext(FormatContext);

  const handleClick = () => {
    if (ctxBoxDisplayStyle === BoxDisplayStyle.box) {
      ctxStudyMetadata.boxStyle = BoxDisplayStyle.uniformBoxes;
      setBoxStyle(BoxDisplayStyle.uniformBoxes);
    } else if (ctxBoxDisplayStyle === BoxDisplayStyle.uniformBoxes) {
      ctxStudyMetadata.boxStyle = BoxDisplayStyle.box;
      setBoxStyle(BoxDisplayStyle.box);
    }
    ctxSetStudyMetadata(ctxStudyMetadata);
    if (!ctxInViewMode) {
      updateMetadataInDb(ctxStudyId, ctxStudyMetadata);
    }
  };

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button className="hover:text-primary" onClick={handleClick}>
        {ctxBoxDisplayStyle === BoxDisplayStyle.uniformBoxes && <TbArrowAutofitContentFilled fontSize="1.5em" />}
        {ctxBoxDisplayStyle === BoxDisplayStyle.box && <TbArrowAutofitContent fontSize="1.5em" />}
      </button>
      {ctxBoxDisplayStyle === BoxDisplayStyle.uniformBoxes && <ToolTip text="Disable uniform width" />}
      {ctxBoxDisplayStyle === BoxDisplayStyle.box && <ToolTip text="Enable uniform width" />}
    </div>
  );
};

export default UniformWidthBtn;
