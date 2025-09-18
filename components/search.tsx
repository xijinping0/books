'use client';

import { useCallback, useEffect, useState } from 'react';
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

export default function CustomSearchDialog(props: SharedProps) {
  const [tag, setTag] = useState<string | undefined>();
  const [localSearch, setLocalSearch] = useState('');
  const { setSearch, query } = useDocsSearch({
    type: 'fetch',
    tag,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 700);

    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
  }, []);

  return (
    <SearchDialog
      search={localSearch}
      onSearchChange={handleSearchChange}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
        <SearchDialogFooter className="flex flex-row">
          <TagsList tag={tag} onTagChange={setTag}>
            <TagsListItem value="tombstone">墓碑</TagsListItem>
            <TagsListItem value="red-sun">红太阳</TagsListItem>
          </TagsList>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
