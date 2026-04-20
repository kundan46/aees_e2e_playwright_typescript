import { Page, expect } from '@playwright/test';

/**
 * Bug Detector utility to automatically identify UI and API errors.
 */
export async function setupBugDetection(page: Page) {
    const errorLogs: string[] = [];

    // Detect Console Errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.error(`[BUG DETECTED] Console Error: ${msg.text()}`);
            errorLogs.push(msg.text());
        }
    });

    // Detect Network Failures (API Bugs)
    page.on('requestfailed', request => {
        console.error(`[BUG DETECTED] Request Failed: ${request.url()} | Reason: ${request.failure()?.errorText}`);
        errorLogs.push(`Network error at ${request.url()}`);
    });

    // Detect Unhandled Exceptions
    page.on('pageerror', exception => {
        console.error(`[BUG DETECTED] Page Exception: ${exception.message}`);
        errorLogs.push(exception.message);
    });

    return {
        getErrors: () => errorLogs,
        hasBugs: () => errorLogs.length > 0
    };
}
