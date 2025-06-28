import React, { useEffect, useRef } from 'react';

interface ModalWrapperProps {
  open: boolean;
  setOpen: (arg: boolean) => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ open, setOpen, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!open || key !== 'Escape') return;
      setOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [open, setOpen]);

  return open ? (
    <div className="fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5">
      <div ref={modalRef} className="w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:px-17.5 md:py-15">
        {children}
      </div>
    </div>
  ) : null;
};

export default ModalWrapper;
