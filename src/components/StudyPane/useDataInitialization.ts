import { useEffect } from 'react';
import { mergeData } from '@/lib/utils';
import { updateMetadataInDb } from '@/lib/actions';
import { convertContentToStudyMetadata } from './dataConversion';
import { BoxDisplayStyle } from '@/lib/types';

/**
 * Custom hook to handle data initialization and migration
 */
export const useDataInitialization = (
  passageData: any,
  content: any,
  studyMetadata: any,
  setStudyMetadata: any,
  setPassageProps: any,
  setBoxDisplayStyle: any
) => {
  useEffect(() => {
    // Merge custom metadata with bible data
    const initPassageProps = mergeData(passageData.bibleData, studyMetadata);
    setPassageProps(initPassageProps);
    setBoxDisplayStyle(studyMetadata.boxStyle || BoxDisplayStyle.box);
  }, [passageData.bibleData, studyMetadata, setPassageProps, setBoxDisplayStyle]);

  useEffect(() => {
    // Handle legacy data migration
    if (!passageData.study.metadata.words) {
      const convertedMetadata = convertContentToStudyMetadata(content);
      passageData.study.metadata = convertedMetadata;
      setStudyMetadata(convertedMetadata);
      updateMetadataInDb(passageData.study.id, convertedMetadata);
    }
  }, [passageData, content, setStudyMetadata]);
};
