export type telEventType = 'START' | 'END' | 'INTERACT' | 'FAILED' | 'IMPRESSION';

export interface IPlayerEvent {
    eventType: string;
    metaData: IPdfMetaData | any;
}

// Generic metadata for player event
interface IPdfMetaData {
    numberOfPagesVisited: number;
    totalNumberOfPages: number;
    currentPagePointer: number;
    pageDuration: Array<object>;
    highlights: Array<object>;
    sessionId: string;
    userPlayBehavior: Array<object>;
    eid: string;
}

export interface PdfComponentInput {
    src: string;
    showOpenFileButton?: boolean;
    showPropertiesButton?: boolean;
    textLayer?: boolean;
    showHandToolButton?: boolean;
    useBrowserLocale?: boolean;
    showBookmarkButton?: boolean;
    showBorders?: boolean;
    startFromPage?: number;
    contextMenuAllowed?: boolean;
    showSidebarButton?: boolean;
    showFindButton?: boolean;
    showPagingButtons?: boolean;
    showZoomButtons?: boolean;
    showPresentationModeButton?: boolean;
    showPrintButton?: boolean;
    showDownloadButton?: boolean;
    showSecondaryToolbarButton?: boolean;
    showRotateButton?: boolean;
    showScrollingButton?: boolean;
    showSpreadButton?: boolean;
    backgroundColor?: string
}

