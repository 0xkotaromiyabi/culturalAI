/**
 * DETERMINISTIC MARKDOWN RENDERER
 * 
 * This renderer converts ArticleOutput JSON to markdown.
 * 100% deterministic - no more surprise formatting from LLM.
 */

import type { ArticleOutput } from './schema';

/**
 * Render ArticleOutput to formatted markdown
 * 
 * CLAUDE.AI-STYLE LAYOUT
 * - Clear paragraph spacing
 * - Visual separators between sections
 * - Optimized for PDF/docs export
 * - Easy to read on all devices
 */
export function renderMarkdown(data: ArticleOutput): string {
    let md = "";

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INTRO - Opening paragraph with breathing room
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (data.intro?.text) {
        md += `${data.intro.text}\n\n`;
        md += `\n`; // Extra line for visual separation
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SECTIONS - Claude.ai style with clear spacing
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach((section, index) => {
            // Section heading with emoji for visual appeal
            if (section.title) {
                md += `## ${section.title}\n\n`;
            }

            // Section paragraph - the main explanatory content
            if (section.paragraph) {
                // Split into sentences for better readability
                const sentences = section.paragraph
                    .split('. ')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);

                // Join sentences with proper spacing
                md += sentences.join('. ') + (section.paragraph.endsWith('.') ? '' : '.');
                md += `\n\n`;
            }

            // Bullet points - if present
            if (section.bullets && section.bullets.length > 0) {
                section.bullets.forEach(item => {
                    md += `- ${item}\n`;
                });
                md += `\n`; // Add line break after bullet list
            }

            // Add extra space between sections (Claude.ai style)
            if (index < data.sections.length - 1) {
                md += `\n`;
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // CONCLUSION - Final thoughts with clear separation
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (data.conclusion?.text) {
        md += `\n`; // Extra line before conclusion
        md += `## Kesimpulan\n\n`;
        md += `${data.conclusion.text}\n`;
    }

    return md.trim();
}

/**
 * Render ArticleOutput to HTML (for rich display)
 */
export function renderHTML(data: ArticleOutput): string {
    let html = "";

    // Intro
    if (data.intro?.text) {
        html += `<p class="intro">${escapeHtml(data.intro.text)}</p>`;
    }

    // Sections
    if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach(section => {
            html += `<section>`;

            if (section.title) {
                html += `<h2>${escapeHtml(section.title)}</h2>`;
            }

            if (section.paragraph) {
                html += `<p>${escapeHtml(section.paragraph)}</p>`;
            }

            if (section.bullets && section.bullets.length > 0) {
                html += `<ul>`;
                section.bullets.forEach(item => {
                    html += `<li>${escapeHtml(item)}</li>`;
                });
                html += `</ul>`;
            }

            html += `</section>`;
        });
    }

    // Conclusion
    if (data.conclusion?.text) {
        html += `<section class="conclusion">`;
        html += `<h2>Kesimpulan</h2>`;
        html += `<p>${escapeHtml(data.conclusion.text)}</p>`;
        html += `</section>`;
    }

    return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
