import { Page, Locator } from '@playwright/test';

/**
 * Smart Locator utility to provide "Self-Healing" capabilities.
 * If the primary selector fails, it attempts to find the element using alternative strategies.
 */
export async function smartClick(page: Page, primarySelector: string, alternatives: string[]) {
    try {
        await page.click(primarySelector, { timeout: 5000 });
    } catch (error) {
        console.warn(`Primary selector "${primarySelector}" failed. Attempting self-healing with alternatives...`);
        for (const alt of alternatives) {
            try {
                await page.click(alt, { timeout: 3000 });
                console.log(`Self-healed using: "${alt}"`);
                return;
            } catch (altError) {
                // Continue to next alternative
            }
        }
        throw new Error(`Failed to find element after trying primary and all alternative selectors.`);
    }
}
