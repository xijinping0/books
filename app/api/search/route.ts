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
});
