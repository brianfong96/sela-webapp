import { FormEvent, useRef, useState } from 'react'
import { createStudy } from '@/lib/actions';
import { parsePassageInfo } from '@/lib/utils';
import ModalWrapper from './ModalWrapper';
import ErrorAlert from '../common/ErrorAlert';

interface NewStudyModalProps {
    open: boolean;
    setOpen: (arg: boolean) => void;
}

export default function NewStudyModal({ open, setOpen }: NewStudyModalProps) {

    const [passage, setPassage] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const onCancel = () => {
        setPassage("");
        setOpen(false);
        setError(null);
    }


    async function onSubmit(event: FormEvent<HTMLFormElement>) {

        event.preventDefault();
        setIsLoading(true);
        setError(null); // Clear previous errors when a new request starts
        const passageInfo = parsePassageInfo(passage);
        if (passageInfo instanceof Error) {
            setError(passageInfo.message);
            setIsLoading(false);
            return;
        } else {
            setOpen(false);
            setPassage('');
        }
        try {
            createStudy(passage);
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
                Start a study in Psalm...
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        min={2}
                        max={50}
                        value={passage}
                        onChange={e => { setPassage(e.target.value) }}
                        name="passage"
                        id="passage"
                        placeholder="23:1-5"
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

