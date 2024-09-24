import React from 'react'
import styles from './styles.module.css'
import { notoSans } from '@app/layout'
import { appColors } from '@utils/colors'
import { hexToRgbWithOpacity } from '@components/LabelAdd/utils'
import Link from 'next/link'
import { formatDateAndTimeForApp } from '@utils/utils'
import { useAppContext } from '@contexts/AppContext'
import { useRouter } from 'next/navigation'


const SearchItem = ({
    type,
    title,
    subtitle,
    extraInfo,
    color = appColors.primaryBlueColor,
    location = '',
    itemId = '',
}: {
    type: string,
    title: string,
    subtitle: string,
    extraInfo?: string,
    color?: string,
    location?: string,
    itemId?: string,
}) => {
    const {
        allBoards,
    } = useAppContext();

    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (type === "card") {
            const foundBoardWithCard = allBoards.find(board => board.lists.find(list => list.cards.find(card => card.id === itemId)));
            if (!foundBoardWithCard) return;

            router.push(`/boards/board/${foundBoardWithCard.id}?${type}Id=${itemId}`)

            return;
        }

        if (type === "list") {
            const foundBoardWithList = allBoards.find(board => board.lists.find(list => list.id === itemId));
            if (!foundBoardWithList) return;

            router.push(`/boards/board/${foundBoardWithList.id}?${type}Id=${itemId}`)

            return;
        }

        router.push(location);
    }
    
    return <Link
        className={styles.search__Result__Item}
        href={location}
        onClick={handleClick}
    >
        <div className={styles.result__Type__Wrap}>
            <span
                className={styles.result__Type}
                style={{
                    color,
                    backgroundColor: hexToRgbWithOpacity(color, 0.15),
                }}
            >
                {type}
            </span>
        </div>
        <div className={styles.result__Detail}>
            <p className={styles.result__Title}>{title}</p>
            <div className={`${notoSans.className} ${styles.result__Subtitle}`}>
                {subtitle}{extraInfo ? `, ${extraInfo}` : ''}
            </div>
        </div>
    </Link>
}

const SearchResultsWrap = ({
    results = null,
    loading = false,
}: {
    results: SearchResultFormatType | null,
    loading?: boolean,
}) => {
    return <section className={styles.search__Results}>
        {
            loading ? <>
                <p className={`${styles.result__Title} ${styles.center}`}>Please wait...</p>
            </>
                :
                !Object.keys(results || {}).map(item => item).find(item => item.length > 0) ? <>
                    <p className={`${styles.result__Title} ${styles.center}`}>No results found matching your query</p>
                </>
                    :
                    <>
                        {
                            React.Children.toArray(
                                results?.cards.map(card => {
                                    return <SearchItem
                                        title={card.title}
                                        type="card"
                                        subtitle={card.description ?? 'No description available'}
                                        color="#9B51E0"
                                        itemId={card.id}
                                    />
                                })
                            )
                        }

                        {
                            React.Children.toArray(
                                results?.lists.map(list => {
                                    return <SearchItem
                                        title={list.title}
                                        type="list"
                                        subtitle={`Created on ${formatDateAndTimeForApp(list?.createdAt)}`}
                                        extraInfo={``}
                                        color="#219653"
                                        itemId={list.id}
                                    />
                                })
                            )
                        }

                        {
                            React.Children.toArray(
                                results?.boards.map(board => {
                                    return <SearchItem
                                        title={board.title}
                                        type="board"
                                        subtitle={board.description ?? 'No description available'}
                                        location={`/boards/board/${board.id}`}
                                    />
                                })
                            )
                        }
                    </>
        }
    </section>
}

export default SearchResultsWrap