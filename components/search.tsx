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
} from 'fumadocs-ui/components/dialog/search';
import { Popover, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { BOOK_NAMES } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { IconChevronDown, IconX } from '@tabler/icons-react';
import { OramaClient } from '@oramacloud/client';

const getCurrentTag = (pathname: string): string | undefined => {
  const tag = pathname.split('/')?.[1];
  if (tag != null && Object.keys(BOOK_NAMES).includes(tag)) {
    return tag;
  }
  return undefined;
};

const BOOK_ENTRIES_WITH_ALL = [
  [undefined, '全部书籍'],
  ...Object.entries(BOOK_NAMES).map(([slug, name]) => [slug, `《${name}》`]),
];

const client = new OramaClient({
  endpoint: process.env.NEXT_PUBLIC_ORAMA_ENDPOINT!,
  api_key: process.env.NEXT_PUBLIC_ORAMA_API_KEY!,
});

export default function CustomSearchDialog(props: SharedProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<string | undefined>(getCurrentTag(pathname));
  const { search, setSearch, query } = useDocsSearch({
    type: 'orama-cloud',
    index: 'crawler',
    client,
    delayMs: 1000,
    tag,
  });

  useEffect(() => {
    setTag(getCurrentTag(pathname));
  }, [pathname]);

  const bookToSearch = BOOK_ENTRIES_WITH_ALL.find(([slug]) => slug === tag)?.[1] ?? '全部书籍';

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-m-1.5',
              })}
            >
              <span className="text-fd-muted-foreground/80 me-2">搜索范围：</span>
              {bookToSearch}
              <IconChevronDown className="size-3.5 text-fd-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-1 gap-1" align="start">
              {BOOK_ENTRIES_WITH_ALL.map(([slug, name], i) => {
                const isSelected = slug === tag;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setTag(slug == null ? undefined : slug);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg text-start px-2 py-1.5',
                      isSelected
                        ? 'text-fd-primary bg-fd-primary/10'
                        : 'hover:text-fd-accent-foreground hover:bg-fd-accent',
                    )}
                  >
                    <p className="font-medium mb-0.5">{name}</p>
                    {/*<p className="text-xs opacity-70">{item.description}</p>*/}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
          {tag != null && (
            <button
              onClick={() => {
                setTag(undefined);
                setOpen(false);
              }}
              className={buttonVariants({
                size: 'sm',
                color: 'ghost',
                className: '-my-1.5',
              })}
            >
              清除搜索范围
              <IconX className="size-3.5 text-fd-muted-foreground" />
            </button>
          )}
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
