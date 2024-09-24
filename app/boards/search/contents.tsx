"use client";

import Spinner from '@components/Spinner/Spinner';
import { useAppContext } from '@contexts/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const SearchContents = () => {
  const {
    allBoards,
    allBoardsLoaded,
  } = useAppContext();

  const [ loading, setLoading ] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const router = useRouter();
  
  useEffect(() => {
    if (!allBoardsLoaded) return;

    const [
      cardId,
      listId,
    ] = [
      searchParams.get('cardId'),
      searchParams.get('listId'),
    ]

    if (cardId) {
      const foundBoardWithCard = allBoards.find(board => board.lists.find(list => list.cards.find(card => card.id === cardId)));
      if (!foundBoardWithCard) return setLoading(false);

      router.push(`/boards/board/${foundBoardWithCard.id}?cardId=${cardId}`)

      return;
    }

    if (listId) {
      const foundBoardWithList = allBoards.find(board => board.lists.find(list => list.id === listId));
      if (!foundBoardWithList) return setLoading(false);
      
      router.push(`/boards/board/${foundBoardWithList.id}?listId=${listId}`)

      return;
    }

  }, [allBoardsLoaded, allBoards, searchParams])

  if (loading) return <>
    <Spinner />
    <p>Just one moment...</p>
  </>

  return <>
  
  </>
}

export default SearchContents;