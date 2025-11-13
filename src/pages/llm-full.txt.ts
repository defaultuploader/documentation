import { getCollection } from 'astro:content';
import removeMd from 'remove-markdown';

export async function GET() {
    const docs = await getCollection('docs', ({ data, slug }) => {
        // Исключаем страницы с языковыми префиксами (не английские)
        const isNotEnglish = slug.startsWith('ru/')

        // Включаем только английские страницы (без префикса) и не исключенные из pagefind
        return !isNotEnglish && data.pagefind !== false;
    });

    // Сортируем документы
    const sortedDocs = docs.sort((a, b) => {
        const orderA = a.data.order || 999;
        const orderB = b.data.order || 999;
        return orderA - orderB;
    });

    let content = 'DOCUMENTATION\n' + '='.repeat(70) + '\n\n';

    for (const doc of sortedDocs) {
        content += `\n# ${doc.data.title}\n`;
        content += '='.repeat(70) + '\n\n';

        const plainText = removeMd(doc.body);
        content += plainText + '\n\n';
    }

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': 'inline; filename="llm-full.txt"'
        },
    });
}