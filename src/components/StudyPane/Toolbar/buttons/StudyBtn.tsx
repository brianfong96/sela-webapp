"use client";

const StudyBtn = ({ setCloneStudyOpen }: { setCloneStudyOpen: (arg: boolean) => void }) => {
  return (
    <div>
      <button
        onClick={() => {
          setCloneStudyOpen(true);
        }}
        className="rounded-lg bg-primary py-2 px-2 text-center text-sm text-white hover:bg-opacity-90 lg:px-6 xl:px-8"
      >
        Copy to My Studies
      </button>
    </div>
  );
};

export default StudyBtn;
