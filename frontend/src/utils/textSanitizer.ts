/**
 * Text sanitization utilities for maintaining professional academic tone
 */

/**
 * Remove emojis and pictographic characters from text
 * Ensures all UI-facing text maintains a professional academic tone
 * 
 * @param text - The text to sanitize
 * @returns Text with all emojis removed
 */
export function removeEmojis(text: string): string {
  if (!text) return text;
  
  // Remove emoji presentation characters and extended pictographics
  return text.replace(
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
    ""
  ).trim();
}

/**
 * Sanitize text for display in UI
 * Removes emojis and normalizes whitespace
 * 
 * @param text - The text to sanitize
 * @returns Sanitized text suitable for UI display
 */
export function sanitizeUIText(text: string): string {
  if (!text) return text;
  
  // Remove emojis
  let sanitized = removeEmojis(text);
  
  // Normalize whitespace (multiple spaces/newlines to single space)
  sanitized = sanitized.replace(/\s+/g, " ").trim();
  
  return sanitized;
}

/**
 * Sanitize LLM-generated content before rendering
 * Use this for any LLM output that will be shown to users
 * 
 * @param content - LLM-generated content
 * @returns Sanitized content safe for UI rendering
 */
export function sanitizeLLMOutput(content: string): string {
  if (!content) return content;
  
  // Remove emojis
  let sanitized = removeEmojis(content);
  
  // Remove excessive punctuation (multiple exclamation/question marks)
  sanitized = sanitized.replace(/!{2,}/g, "!");
  sanitized = sanitized.replace(/\?{2,}/g, "?");
  
  return sanitized.trim();
}
