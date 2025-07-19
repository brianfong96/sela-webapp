"use client";

import { BiSolidColorFill, BiFont } from "react-icons/bi";
import { MdOutlineModeEdit } from "react-icons/md";
import { SwatchesPicker } from 'react-color';
import React, { useContext, useEffect, useCallback, useState } from 'react';

import { FormatContext } from '../index';
import { ColorActionType, ColorPickerProps } from "@/lib/types";
import { updateMetadataInDb } from "@/lib/actions";

import { StudyMetadata } from '@/lib/data';
import ToolTip from './ToolTip';

const ColorActionBtn: React.FC<ColorPickerProps> = ({
  colorAction,
  setSelectedColor,
  setColorAction,
}) => {
  const { ctxStudyId, ctxStudyMetadata, ctxColorAction, ctxColorFill, ctxBorderColor, ctxTextColor,
    ctxNumSelectedWords, ctxSelectedWords, ctxNumSelectedStrophes, ctxSelectedStrophes, ctxAddToHistory
  } = useContext(FormatContext);

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [displayColor, setDisplayColor] = useState("");
  const [stagedMetadata, setStagedMetadata] = useState<StudyMetadata | undefined>(undefined);

  const refreshDisplayColor = useCallback(() => {
    colorAction === ColorActionType.colorFill && setDisplayColor(ctxColorFill);
    colorAction === ColorActionType.borderColor && setDisplayColor(ctxBorderColor);
    colorAction === ColorActionType.textColor && setDisplayColor(ctxTextColor);
  }, [colorAction, ctxColorFill, ctxBorderColor, ctxTextColor]);

  useEffect(() => {
    const hasSelectedItems =
      ctxNumSelectedWords > 0 || (ctxNumSelectedStrophes > 0 && colorAction != ColorActionType.textColor);
    setButtonEnabled(hasSelectedItems);

    if (!hasSelectedItems) {
      setColorAction(ColorActionType.none);
      setSelectedColor("");
      if (stagedMetadata !== undefined) {
        ctxAddToHistory(stagedMetadata);
        updateMetadataInDb(ctxStudyId, stagedMetadata);
        setStagedMetadata(undefined);
      }
    } else {
      refreshDisplayColor();
    }
  }, [ctxNumSelectedWords, ctxNumSelectedStrophes, refreshDisplayColor, setColorAction, setSelectedColor, colorAction]);

  useEffect(() => {
    if (ctxColorAction === ColorActionType.resetColor || ctxColorAction === ColorActionType.resetAllColor) {
      refreshDisplayColor();
      setColorAction(ColorActionType.none);
    }
  }, [ctxColorAction, refreshDisplayColor]);

  const handleClick = () => {
    setColorAction(ColorActionType.none);
    if (buttonEnabled) {
      setColorAction(ctxColorAction != colorAction ? colorAction : ColorActionType.none);
      setSelectedColor("");
    }
  };

  const handleColorPickerChange = (color: any) => {
    setColorAction(colorAction);
    setSelectedColor(color.hex);
    setDisplayColor(color.hex);
    let colorObj = {} as any;
    switch (colorAction) {
      case ColorActionType.colorFill: {
        colorObj = { fill: color.hex };
        break;
      }
      case ColorActionType.borderColor: {
        colorObj = { border: color.hex };
        break;
      }
      case ColorActionType.textColor: {
        colorObj = { text: color.hex };
        break;
      }
    }

    let isChanged = false;

    ctxSelectedWords.forEach((word) => {
      const wordId = word.wordId;
      const wordMetadata = ctxStudyMetadata.words[wordId];

      if (!wordMetadata) {
        isChanged = true;
        ctxStudyMetadata.words[wordId] = { color: colorObj } as any;
        return;
      }

      if (!wordMetadata.color) {
        isChanged = wordMetadata.color !== colorObj;
        wordMetadata.color = colorObj as any;
        return;
      }

      const currentColor = wordMetadata.color as any;

      switch (colorAction) {
        case ColorActionType.colorFill:
          if (currentColor.fill !== color.hex) {
            isChanged = true;
            currentColor.fill = color.hex;
          }
          break;
        case ColorActionType.borderColor:
          if (currentColor.border !== color.hex) {
            isChanged = true;
            currentColor.border = color.hex;
          }
          break;
        case ColorActionType.textColor:
          if (currentColor.text !== color.hex) {
            isChanged = true;
            currentColor.text = color.hex;
          }
          break;
      }
    });

    if (ctxSelectedStrophes.length > 0) {
      const selectedWordId = ctxSelectedStrophes[0].lines.at(0)?.words.at(0)?.wordId || 0;
      const wordMetadata = ctxStudyMetadata.words[selectedWordId];

      if (wordMetadata.stropheMd && wordMetadata.stropheMd.color) {
        const colorProp =
          colorAction === ColorActionType.colorFill ? "fill" : colorAction === ColorActionType.borderColor ? "border" : null;
        if (colorProp && wordMetadata.stropheMd.color[colorProp] !== color.hex) {
          wordMetadata.stropheMd.color[colorProp] = color.hex;
          isChanged = true;
        }
      } else {
        wordMetadata.stropheMd ??= {} as any;
        wordMetadata.stropheMd.color ??= colorObj as any;
        isChanged = true;
      }
    }

    isChanged && setStagedMetadata(ctxStudyMetadata);
  };

  return (
    <div className="flex flex-col items-center justify-center px-2 xsm:flex-row ClickBlock">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'} ClickBlock`}
        onClick={handleClick}
      >
        {colorAction === ColorActionType.colorFill && (
          <BiSolidColorFill className="ClickBlock" fillOpacity={buttonEnabled ? '1' : '0.4'} fontSize="1.4em" />
        )}
        {colorAction === ColorActionType.borderColor && (
          <MdOutlineModeEdit className="ClickBlock" fillOpacity={buttonEnabled ? '1' : '0.4'} fontSize="1.4em" />
        )}
        {colorAction === ColorActionType.textColor && (
          <BiFont className="ClickBlock" fillOpacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        <div
          style={{
            width: '100%',
            height: '0.25rem',
            background: `${buttonEnabled ? displayColor : '#FFFFFF'}`,
            marginTop: '0.05rem',
          }}
        ></div>
      </button>

      {ctxColorAction === colorAction && buttonEnabled && (
        <div className="relative z-10">
          <div className="absolute top-6 -left-6">
            <SwatchesPicker width={580} height={160} color={displayColor} onChange={handleColorPickerChange} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorActionBtn;
