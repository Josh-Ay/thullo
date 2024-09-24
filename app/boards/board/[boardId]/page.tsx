import { BoardService } from '@services/boardService';
import { defaultMetadata } from '@utils/utils';
import { headers } from 'next/headers';
import SingleBoardPageDetails from './details';

export async function generateMetadata({
    params,
}: {
    params: {
        [key: string]: string,
    };
}) {
    const { boardId } = params;
    if (!boardId) return {
        ...defaultMetadata,
        title: "Invalid Board | Thullo",
    };

    const headersList = headers();

    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    const currentHostUrl = `${protocol}://${host}`;

    const boardService = new BoardService();

    try {
        const res = await boardService.getSingleBoardDetails(boardId, currentHostUrl);
        return {
            ...defaultMetadata,
            title: `${res?.title} | Thullo`,
        }
    } catch (error) {
        return {
            ...defaultMetadata,
            title: "Invalid Board | Thullo",
        };
    }
}

const SingleBoardPage = ({
    params,
}: {
    params: {
        [key: string]: string,
    };
}) => {
    const { boardId } = params;
    if (!boardId) return <></>

    return <SingleBoardPageDetails
        boardId={boardId}
    />
}

export default SingleBoardPage;