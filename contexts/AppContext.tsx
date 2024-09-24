"use client";

import { BoardService } from "@services/boardService";
import React, { createContext, useContext, useEffect, useState } from "react";

const initialAppContext: {
    allBoards: BoardType[],
    setAllBoards: (boards: BoardType[]) => void,
    allBoardsLoading: boolean,
    setAllBoardsLoading: (newVal: boolean) => void,
    allBoardsLoaded: boolean,
    setAllBoardsLoaded: (newVal: boolean) => void,
    currentBoardDetails: BoardType | null,
    setCurrentBoardDetails: (boards: BoardType | null) => void,
} = {
    allBoards: [],
    setAllBoards: (boards: BoardType[]) => { },
    allBoardsLoading: true,
    setAllBoardsLoading: () => { },
    allBoardsLoaded: false,
    setAllBoardsLoaded: (newVal: boolean) => { },
    currentBoardDetails: null,
    setCurrentBoardDetails: (board: BoardType | null) => { },
}

const AppContext = createContext(initialAppContext);

export const useAppContext = () => useContext(AppContext);

export default function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [allBoards, setAllBoards] = useState<BoardType[]>([]);
    const [allBoardsLoading, setAllBoardsLoading] = useState<boolean>(true);
    const [allBoardsLoaded, setAllBoardsLoaded] = useState<boolean>(false);
    const [currentBoardDetails, setCurrentBoardDetails] = useState<BoardType | null>(null);

    useEffect(() => {
        if (allBoardsLoaded) return;

        setAllBoardsLoading(true);

        const boardService = new BoardService();

        boardService.fetchAllBoards().then(res => {
            setAllBoards(res);
            setAllBoardsLoading(false);
            setAllBoardsLoaded(true);
        }).catch(err => {
            setAllBoardsLoading(false);
        });

    }, [allBoardsLoaded])

    return <>
        <AppContext.Provider value={{
            allBoards,
            setAllBoards,
            allBoardsLoading,
            setAllBoardsLoading,
            allBoardsLoaded,
            setAllBoardsLoaded,
            currentBoardDetails,
            setCurrentBoardDetails,
        }}>
            {children}
        </AppContext.Provider>
    </>
}