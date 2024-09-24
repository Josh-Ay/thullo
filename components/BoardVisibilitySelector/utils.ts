import { MdOutlinePublic } from 'react-icons/md'
import { IoIosLock } from 'react-icons/io'
import { IconType } from 'react-icons'

export const visibilityOptions: {
    icon: IconType,
    title: string,
    value: string,
    info: string,
}[] = [
        {
            icon: MdOutlinePublic,
            title: "Public",
            value: "public",
            info: "Anyone on the internet can see this.",
        },
        {
            icon: IoIosLock,
            title: "Private",
            value: "private",
            info: "Only board members can see this.",
        },
    ]
