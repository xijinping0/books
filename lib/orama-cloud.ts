/**
 * Copied from https://github.com/fuma-nama/fumadocs/blob/2862a10c2d78b52c0a3f479ad21b255cc0031fc9/packages/core/src/search/orama-cloud.ts#L86
 */
import type { CloudManager } from '@oramacloud/client';
import { StructuredData } from 'fumadocs-core/mdx-plugins';

export interface SyncOptions {
  /**
   * Index name to sync
   */
  index: string;

  documents: OramaDocument[];

  /**
   * Deploy changes
   *
   * @defaultValue true
   */
  autoDeploy?: boolean;

  /**
   * Number of documents to send in each batch
   *
   * @defaultValue 1000
   */
  batchSize?: number;
}

export type I18nSyncOptions = Omit<SyncOptions, 'index' | 'documents'> & {
  /**
   * Indexes to sync.
   *
   * Pairs of `locale`-`index`.
   **/
  indexes: Record<string, string>;

  documents: {
    locale: string;
    items: OramaDocument[];
  }[];
};

export interface OramaDocument {
  /**
   * The ID of document, must be unique
   */
  id: string;

  title: string;
  description?: string;

  /**
   * URL to the page
   */
  url: string;
  structured: StructuredData;

  /**
   * Tag to filter results
   */
  tag?: string;

  /**
   * Data to be added to each section index
   */
  extra_data?: object;
}

export interface OramaIndex {
  id: string;

  title: string;
  url: string;

  tag?: string;

  /**
   * The id of page, used for `group by`
   */
  page_id: string;

  /**
   * Heading content
   */
  section?: string;

  /**
   * Heading (anchor) id
   */
  section_id?: string;

  content: string;
}

export async function sync(cloudManager: CloudManager, options: SyncOptions): Promise<void> {
  const { autoDeploy = true, batchSize = 1000 } = options;
  const index = cloudManager.index(options.index);
  const items = options.documents.flatMap(toIndex);

  await index.empty();

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    console.info(`Inserting batch ${i} - ${i + batch.length} / ${items.length}`);
    await index.insert(batch);
  }

  if (autoDeploy) {
    await index.deploy();
  }
}

export async function syncI18n(
  cloudManager: CloudManager,
  options: I18nSyncOptions,
): Promise<void> {
  const { autoDeploy = true, batchSize = 1000 } = options;

  const tasks = options.documents.map(async (document) => {
    const index = cloudManager.index(options.indexes[document.locale]);
    const items = document.items.flatMap(toIndex);

    await index.empty();

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.info(
        `[${document.locale}] Inserting batch ${i} - ${i + batch.length} / ${items.length}`,
      );
      await index.insert(batch);
    }

    if (autoDeploy) {
      await index.deploy();
    }
  });

  await Promise.all(tasks);
}

function toIndex(page: OramaDocument): OramaIndex[] {
  let id = 0;
  const indexes: OramaIndex[] = [];
  const scannedHeadings = new Set<string>();

  function createIndex(
    section: string | undefined,
    sectionId: string | undefined,
    content: string,
  ): OramaIndex {
    return {
      id: `${page.id}-${(id++).toString()}`,
      title: page.title,
      url: page.url,
      page_id: page.id,
      tag: page.tag,
      section,
      section_id: sectionId,
      content,
      ...page.extra_data,
    };
  }

  if (page.description) indexes.push(createIndex(undefined, undefined, page.description));

  page.structured.contents.forEach((p) => {
    const heading = p.heading ? page.structured.headings.find((h) => p.heading === h.id) : null;

    const index = createIndex(heading?.content, heading?.id, p.content);

    if (heading && !scannedHeadings.has(heading.id)) {
      scannedHeadings.add(heading.id);

      indexes.push(createIndex(heading.content, heading.id, heading.content));
    }

    indexes.push(index);
  });

  return indexes;
}
