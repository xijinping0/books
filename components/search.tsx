'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
  TagsList,
  TagsListItem,
} from 'fumadocs-ui/components/dialog/search';

const getCurrentTag = (pathname: string) => {
  return pathname.split('/')?.[1];
};

export default function CustomSearchDialog(props: SharedProps) {
  const pathname = usePathname();
  const [tag, setTag] = useState<string | undefined>(getCurrentTag(pathname));
  const { search, setSearch, query } = useDocsSearch({
    type: 'fetch',
    delayMs: 1000,
    tag,
  });

  useEffect(() => {
    setTag(getCurrentTag(pathname));
  }, [pathname]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
        <SearchDialogFooter className="flex flex-row">
          <TagsList tag={tag} onTagChange={setTag} allowClear>
            <TagsListItem value="tombstone">墓碑</TagsListItem>
            <TagsListItem value="red-sun">红太阳</TagsListItem>
          </TagsList>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
