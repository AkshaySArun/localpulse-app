
import { NextResponse } from "next/server";



const isClerkEnabled = false;

const mockClerkMiddleware = (handler?: any) => {
    return (req: any) => {
        return NextResponse.next();
    };
};


const mockCreateRouteMatcher = (patterns: string[]) => {
    return (req: any) => {
        return false;
    };
};

export const clerkMiddleware = mockClerkMiddleware;
export const createRouteMatcher = mockCreateRouteMatcher;
