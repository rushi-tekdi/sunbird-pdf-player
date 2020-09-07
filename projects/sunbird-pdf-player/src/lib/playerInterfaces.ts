export interface PdfComponentInput {
    src: string;
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
    backgroundColor?: string;
    height?: string;
}

