import React, { useState, useContext } from 'react';

import { DEFAULT_COLOR_FILL, DEFAULT_BORDER_COLOR, DEFAULT_TEXT_COLOR, FormatContext } from '../../index';
import { WordProps, LexiconData } from '@/lib/data';

export const RelatedWordBlock = ({
  id, count, rootData, relatedWords
}: {
  id: number,
  count: number,
  rootData: LexiconData,
  relatedWords: WordProps[]
}) => {

  const { ctxIsHebrew, ctxSelectedWords, ctxSetNumSelectedWords, ctxSetSelectedWords } = useContext(FormatContext)
  const [selected, setSelected] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setSelected(prevState => !prevState);

    let updatedSelectedWords = [...ctxSelectedWords];
    if (!selected) {
      updatedSelectedWords = ctxSelectedWords.concat(relatedWords);
    } else {
      relatedWords.forEach((dsd) => {
        updatedSelectedWords.splice(updatedSelectedWords.indexOf(dsd), 1)
      })
    }
    ctxSetSelectedWords(updatedSelectedWords);
    ctxSetNumSelectedWords(updatedSelectedWords.length);
  };

  return (
    <div className="flex my-1">
      <div
        id={id.toString()}
        key={id}
        className={`wordBlock mx-1 ClickBlock ${selected ? 'rounded border outline outline-offset-1 outline-[3px] outline-[#FFC300] drop-shadow-md' : 'rounded border outline-offset-[-4px]'}`}
        data-clicktype="clickable"
        style={
          {
            background: `${DEFAULT_COLOR_FILL}`,
            border: `2px solid ${DEFAULT_BORDER_COLOR}`,
            color: `${DEFAULT_TEXT_COLOR}`,
          }
        }>
        <span
          className="flex mx-1 my-1"
          onClick={handleClick}
        >
          <span
            className={`flex select-none px-2 py-1 items-center justify-center text-center hover:opacity-60 leading-none text-lg`}
          > { ctxIsHebrew ? rootData.lemma : rootData.gloss } </span>
          <span className="flex h-6.5 w-full min-w-6.5 max-w-6.5 items-center justify-center rounded-full bg-[#EFEFEF] text-black text-sm">{count}</span>
        </span>
      </div>
    </div>
  );

}
