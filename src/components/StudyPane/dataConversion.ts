import { StudyMetadata, StanzaMetadata, StropheMetadata, WordMetadata } from '@/lib/data';

/**
 * Converts legacy PassageData content to StudyMetadata format
 * This function handles the migration from old content structure to new metadata structure
 */
export const convertContentToStudyMetadata = (content: any): StudyMetadata => {
  const studyMetadata: StudyMetadata = { words: {} };

  content.stanzas.forEach((stanza: any, stanzaIdx: number) => {
    const stanzaMetadata: StanzaMetadata = (stanza.expanded === false) ? { expanded: false } : {};

    stanza.strophes.forEach((strophe: any, stropheIdx: number) => {
      let stropheMetadata: StropheMetadata = (strophe.expanded) ? {} : { expanded: false };
      
      // Handle strophe border color
      if (strophe.borderColor) {
        stropheMetadata.color = { border: strophe.borderColor };
      }
      
      // Handle strophe fill color
      if (strophe.colorFill) {
        if (stropheMetadata.color) {
          stropheMetadata.color.fill = strophe.colorFill;
        } else {
          stropheMetadata.color = { fill: strophe.colorFill };
        }
      }

      strophe.lines.forEach((line: any, lineIdx: number) => {
        line.words.forEach((word: any, wordIdx: number) => {
          const wordMetadata = createWordMetadata(word, stropheMetadata, stanzaMetadata);
          
          if (Object.keys(wordMetadata).length > 0) {
            if (!studyMetadata.words) {
              studyMetadata.words = {};
            }
            studyMetadata.words[word.id] = wordMetadata;
          }
        });
      });
    });
  });

  return studyMetadata;
};

/**
 * Creates word metadata from word data and parent metadata
 */
const createWordMetadata = (
  word: any, 
  stropheMetadata: StropheMetadata, 
  stanzaMetadata: StanzaMetadata
): WordMetadata => {
  let wordMetadata: WordMetadata = {};

  // Handle word colors
  if (word.borderColor) {
    wordMetadata.color = { border: word.borderColor };
  }
  
  if (word.colorFill) {
    if (wordMetadata.color) {
      wordMetadata.color.fill = word.colorFill;
    } else {
      wordMetadata.color = { fill: word.colorFill };
    }
  }
  
  if (word.textColor) {
    if (wordMetadata.color) {
      wordMetadata.color.text = word.textColor;
    } else {
      wordMetadata.color = { text: word.textColor };
    }
  }

  // Handle indentation
  if (word.numIndent > 0) {
    wordMetadata.indent = word.numIndent;
  }

  // Handle structural divisions
  if (word.stropheDiv) {
    wordMetadata.stropheDiv = word.stropheDiv;
    if (Object.keys(stropheMetadata).length > 0) {
      wordMetadata.stropheMd = stropheMetadata;
    }
  }
  
  if (word.stanzaDiv) {
    wordMetadata.stanzaDiv = word.stanzaDiv;
    if (Object.keys(stanzaMetadata).length > 0) {
      wordMetadata.stanzaMd = stanzaMetadata;
    }
  }

  return wordMetadata;
};
