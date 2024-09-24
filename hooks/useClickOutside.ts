import { useEffect } from "react";


export default function useClickOutside({
    elemRef,
    handleClickOutside = () => { },
}: {
    elemRef: React.RefObject<HTMLElement>;
    handleClickOutside: () => void;
}) {

    useEffect(() => {

        const closeCurrentItem = (e: MouseEvent | KeyboardEvent) => {
            if (!elemRef.current) return;

            if (e instanceof KeyboardEvent) {
                if (e.key === "Escape") handleClickOutside();
            }

            if (e instanceof MouseEvent) {
                if (elemRef.current && !elemRef.current.contains(e.target as Node)) handleClickOutside();
            }
        }

        document.addEventListener("click", closeCurrentItem, true);
        document.addEventListener("keydown", closeCurrentItem, true);

        return () => {
            document.removeEventListener("click", closeCurrentItem, true);
            document.removeEventListener("keydown", closeCurrentItem, true);
        }

    }, [elemRef, handleClickOutside]);

}
