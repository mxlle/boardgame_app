/// <reference types="react-scripts" />

type ShareData = {
    title? : string;
    text? : string;
    url? : string;
};

interface Navigator
{
    share? : (data? : ShareData) => Promise<void>;
}