import { handleScrollToElement } from "@utils/utils";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const timeToWaitInMS = 1050;

export default function useScrollToElementInCanvas() {
    const searchParams = useSearchParams();

    const clearSearchParams = () => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.search = '';

            window.history.replaceState({}, document.title, url.toString());
        }
    };

    useEffect(() => {
        const [
            cardId,
            listId,
        ] = [
                searchParams.get('cardId'),
                searchParams.get('listId'),
            ]

        if (!cardId && !listId) return;
        
        // setting a timeout to allow the virtual dom fully render before attempting to find an item by id
        const timeout = setTimeout(() => {
            handleScrollToElement(document.getElementById(cardId ?? listId ?? ''));
            clearSearchParams();
        }, timeToWaitInMS);

        return () => clearTimeout(timeout);
    }, [searchParams])

}