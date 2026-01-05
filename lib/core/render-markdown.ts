/**
 * DETERMINISTIC MARKDOWN RENDERER
 * 
 * This renderer converts ArticleOutput JSON to markdown.
 * 100% deterministic - no more surprise formatting from LLM.
 */

import type { ArticleOutput } from './schema';

/**
 * Render ArticleOutput to formatted markdown
 */
export function renderMarkdown(data: ArticleOutput): string {
    let md = "";

    // Intro paragraph
    if (data.intro?.text) {
        md += `${data.intro.text}\n\n`;
    }

    // Sections
    if (data.sections && Array.isArray(data.sections)) {
        data.sections.forEach(section => {
            // Section heading
            if (section.title) {
                md += `## ${section.title}\n\n`;
            }

            // Section paragraph
            if (section.paragraph) {
                md += `${section.paragraph}\n\n`;
            }

            // Bullets (only if needed)
            if (section.bullets && section.bullets.length > 0) {
                section.bullets.forEach(item => {
                    md += `- ${item}\n`;
                });
                md += `\n`;
            }
        });
    }

    // Conclusion
    if (data.conclusion?.text) {
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
