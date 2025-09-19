import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { stopwords } from '@orama/stopwords/mandarin';

export const { GET } = createFromSource(source, {
  components: {
    tokenizer: createTokenizer({
      language: 'mandarin',
      stopWords: stopwords,
    }),
  },
  search: {
    threshold: 0,
    exact: true,
    limit: 10,
  },
  buildIndex: (page: any) => {
    const pagePaths = page.data._file?.path?.split('/') ?? [];
    const tag = pagePaths?.[0];

    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag,
    };
  },
});
