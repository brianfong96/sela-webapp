import React, { useContext } from 'react';

import { FormatContext } from '../index';
import { StanzaBlock } from './StanzaBlock';

import { WordProps } from '@/lib/data';

import useStructureUpdate from '@/hooks/useStructureUpdate';
import useIdenticalWordSelection from '@/hooks/useIdenticalWordSelection';

import { useDragToSelect } from '@/hooks/useDragToSelect';

const Passage = ({
  bibleData,
}: {
  bibleData: WordProps[];
}) => {
  const { ctxPassageProps } = useContext(FormatContext);

  const { isDragging, handleMouseDown, containerRef, getSelectionBoxStyle } =
    useDragToSelect(ctxPassageProps);

  useStructureUpdate(bibleData);
  useIdenticalWordSelection(ctxPassageProps);

  return (
    <div
      key={`passage`}
      onMouseDown={handleMouseDown}
      ref={containerRef}
      style={{ WebkitUserSelect: 'text', userSelect: 'text' }}
      className="h-0"
    >
      <div id="selaPassage" className='flex relative pl-2 py-4'>
        {
          ctxPassageProps.stanzaProps.map((stanza) => {
            return (
              <StanzaBlock stanzaProps={stanza} key={stanza.stanzaId} />
            )
          })
        }
      </div>
      {isDragging && <div style={getSelectionBoxStyle()} />}
    </div>
  );
};

export default Passage;
