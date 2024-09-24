import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import SearchBar from '@components/SearchBar/SearchBar'
import { notoSans } from '@app/layout';
import { availableLabelColors, initialLabelDetails } from './utils';
import { PiTagSimpleFill } from 'react-icons/pi';
import CustomButton from '@components/CustomButton/CustomButton';
import { useAppContext } from '@contexts/AppContext';
import CardLabelWrap from './components/CardLabelWrap';
import { AiOutlineCheck } from 'react-icons/ai';
import { toast } from 'sonner';
import { CardService } from '@services/cardService';
import SectionTitleWithIcon from '@components/SectionTitleWithIcon/SectionTitleWithIcon';


const LabelAdd = ({
    className,
    cardId,
    listId,
    cardLabels = [],
}: {
    className?: string,
    cardId: string,
    listId: string,
    cardLabels: CardLabelType[],
}) => {
    const {
        currentBoardDetails,
        setCurrentBoardDetails,
    } = useAppContext();

    const [labels, setLabels] = useState<CardLabelType[]>([]);
    const [newLabelDetail, setNewLabelDetail] = useState(initialLabelDetails);
    const [loading, setLoading] = useState<boolean>(false);

    const cardService = new CardService();

    useEffect(() => {
        setLabels(cardLabels);
    }, [cardLabels])

    const handleUpdateDetail = (name: string, value: string) => {
        setNewLabelDetail((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const handleAddNewLabel = async () => {
        if (newLabelDetail.name.length < 1) return toast.info('Please enter a name for your label');
        if (newLabelDetail.color.length < 1) return toast.info('Please select a color for your label');
        if (loading) return;

        const copyOfBoardDetails: BoardType = JSON.parse(JSON.stringify(currentBoardDetails));
        const updatedCardLabels = labels.slice();

        setLoading(true);

        try {
            const res = await cardService.addNewCardLabel(cardId, {
                ...newLabelDetail,
                listId,
            });

            updatedCardLabels.unshift(res);
            setLabels(updatedCardLabels);

            setNewLabelDetail(initialLabelDetails);
            setLoading(false);

            const foundCardListing = copyOfBoardDetails.lists.find(list => list.id === listId);
            if (!foundCardListing) return;

            const copyOfCardsInList = foundCardListing.cards.slice();

            const foundEditedCardIndex = copyOfCardsInList.findIndex(item => item.id === cardId);
            if (foundEditedCardIndex === -1) return;

            copyOfCardsInList[foundEditedCardIndex].labels = updatedCardLabels;
            foundCardListing.cards = copyOfCardsInList;

            setCurrentBoardDetails(copyOfBoardDetails);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <div className={`${styles.label__Search} ${className}`}>
            <section>
                <h2 className={styles.title}>Label</h2>
                <p className={`${styles.subtitle} ${notoSans.className}`}>Select a name and a color</p>
            </section>

            <SearchBar
                searchVal={newLabelDetail.name}
                handleUpdateSearchValue={(name, val) => handleUpdateDetail('name', val)}
                minWidth='unset'
                inputDisabled={loading}
                placeholder='Label...'
                hideSearchBtn={true}
            />

            <div className={styles.colors__Wrap}>
                {
                    React.Children.toArray(availableLabelColors.map(color => {
                        return <div
                            style={{ backgroundColor: color }}
                            className={`${styles.label__Color__Item} ${newLabelDetail.color === color ? styles.selected : ''}`}
                            onClick={() => handleUpdateDetail('color', color)}
                        >
                            <AiOutlineCheck
                                color={color !== '#E0E0E0' ? '#fff' : '#1F1F1F'}
                                className={styles.label__Check__Icon}
                            />
                        </div>
                    }))
                }
            </div>


            <section className={styles.card__Labels__Wrap}>
                <SectionTitleWithIcon
                    title='Available'
                    icon={PiTagSimpleFill}
                />

                <CardLabelWrap
                    labels={labels}
                />
            </section>

            <CustomButton
                title={loading ? 'Adding' : 'Add'}
                width='max-content'
                margin='0 auto'
                handleClick={handleAddNewLabel}
            />
        </div>
    )
}

export default LabelAdd