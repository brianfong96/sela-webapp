import { FormEvent, useRef, useState } from 'react'
import { cloneStudy } from '@/lib/actions';
import { StudyData } from '@/lib/data';
import ModalWrapper from './ModalWrapper';
import ErrorAlert from '../common/ErrorAlert';

interface CloneStudyModalProps {
    originalStudy: StudyData;
    open: boolean;
    setOpen: (arg: boolean) => void;
}

export default function CloneStudyModal({ originalStudy, open, setOpen }: CloneStudyModalProps) {

    const [clonedStudyName, setClonedStudyName] = useState("Copy of " + originalStudy.name.trimEnd());
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const inputRef = useRef<HTMLInputElement>(null);
    
    const onCancel = () => {
        setClonedStudyName("");
        setOpen(false);
        setError(null);
    }


    async function onSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();
        setIsLoading(true);
        setError(null); // Clear previous errors when a new request starts
        setOpen(false);

        try {
            cloneStudy(originalStudy, clonedStudyName);
            setClonedStudyName('');
        } catch (e) {
            // Capture the error message to display to the user
            setError((e as Error).message);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ModalWrapper open={open} setOpen={setOpen}>
            <h3 className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                Rename your study to...
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <form onSubmit={onSubmit}>
                <input
                    ref={inputRef}
                        type="text"
                        min={2}
                        max={50}
                        defaultValue={clonedStudyName}
                        onChange={e => { setClonedStudyName(e.target.value) }}
                        name="studyName"
                        id="studyName"
                        className="w-full rounded-lg border-[2px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    />

                    <div className="-mx-3 my-10 flex flex-wrap gap-y-4">
                        <div className="w-full px-3 2xsm:w-1/2">
                            <button type="reset"
                                onClick={() => {
                                    onCancel();
                                }}
                                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="w-full px-3 2xsm:w-1/2">
                            <button type="submit"
                                className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                            >
                                {isLoading ? 'Loading...' : 'OK'}
                            </button>
                        </div>
                    </div>
                </form>
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        </ModalWrapper>

    )
}

