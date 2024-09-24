import { NextResponse } from "next/server"

export const generateNextResponse = (message: string, status: number = 200, data = {}) => {
    return NextResponse.json({
        message,
        data,
    }, {
        status,
    })
}