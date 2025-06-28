'use client';

import { FormEvent, useState, useRef } from "react";
import { IconEdit } from "@tabler/icons-react";
import { updateStudyName } from '@/lib/actions';
import ModalWrapper from './ModalWrapper';
import ErrorAlert from '../common/ErrorAlert';

const EditStudyModal = ({
  studyId,
  studyName,
  setTriggerFetch
}: {
  studyId: string;
  studyName: string;
  setTriggerFetch: (arg: boolean) => void;
} ) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const onCancel = () => {
    setModalOpen(false);
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim() || "";
    if (!name) {
      setError("Study title cannot be empty.");
      return;
    }
    try {
      await updateStudyName(studyId, name);
      setModalOpen(false);
      setTriggerFetch(true);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <>
      <button
        className="hover:text-primary"
        onClick={() => {
            setModalOpen(true);
        }} >
        <IconEdit />
      </button>

      <ModalWrapper open={modalOpen} setOpen={setModalOpen}>
          <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
            Rename to
          </h3>
          <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <form onSubmit={onSubmit}>
              <input type="hidden" name="id" value={studyId} />  
              <input
                type="text"
                min={2}
                max={50}
                defaultValue={studyName}
                name="name"
                id="name"
                className="w-full rounded-lg border-[2px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />

              <div className="-mx-3 my-10 flex flex-wrap gap-y-4">
                <div className="w-full px-3 2xsm:w-1/2">
                  <button type="reset"
                    onClick={onCancel}
                    className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                  Cancel
                  </button>
                </div>
                <div className="w-full px-3 2xsm:w-1/2">
                  <button type="submit"
                    className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  >
                  OK
                  </button>
                </div>
              </div>
            </form>
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      </ModalWrapper>
    </>
  );
};

export default EditStudyModal;
