import { getCollection } from 'astro:content';

export async function GET() {
    const siteUrl = import.meta.env.SITE || 'https://docs.defaultuploader.com';

    // Получаем английские страницы
    const nonEnglishLocales = ['ru', 'de', 'fr', 'es'];
    const excludedSections = ['index']; // Исключаем служебные разделы

    const docs = await getCollection('docs', ({ data, slug }) => {
        const isNotEnglish = nonEnglishLocales.some(locale => slug.startsWith(`${locale}/`));
        return !isNotEnglish && data.pagefind !== false;
    });

    // Группируем по разделам (первая часть slug)
    const sections = new Map<string, Array<{ slug: string; title: string }>>();

    docs.forEach(doc => {
        const section = doc.slug.split('/')[0];

        // Пропускаем исключенные разделы
        if (excludedSections.includes(section)) return;

        if (!sections.has(section)) {
            sections.set(section, []);
        }
        sections.get(section)!.push({
            slug: doc.slug,
            title: doc.data.title
        });
    });

    let content = `# ${siteUrl}

> Documentation for Default Uploader

## Full Documentation

${siteUrl}/llm-full.txt

## Sections

`;

    // Добавляем разделы
    const sectionNames: Record<string, string> = {
        'start': 'Getting Started',
        'api': 'API Reference',
        'quotas': 'Quotas & Limits',
        'price': 'Pricing',
        'introduction': 'Introduction',
    };

    for (const [section, pages] of sections) {
        const displayName = sectionNames[section] || section.charAt(0).toUpperCase() + section.slice(1);
        content += `\n## ${displayName}\n\n`;

        // Добавляем все страницы раздела
        pages.forEach(page => {
            content += `${siteUrl}/${page.slug}/\n`;
        });
    }

    content += `\n## Details

This documentation is optimized for use with language models.
All content is available in plain text format at ${siteUrl}/llm-full.txt
`;

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    });
}