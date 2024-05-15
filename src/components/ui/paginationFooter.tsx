'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/src/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from './button';

const PaginationFooter = (count: { totalItems: number }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);
  const currentPage = searchParams.get('page') || '1';
  const itemPerPage = 10;
  let pageNumbers = [];
  for (let i = 1; i <= Math.ceil(count.totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }

  // const lastItemIndex = parseInt(currentPage) * itemPerPage;
  // const firstItemIndex = lastItemIndex - itemPerPage;

  const handleChangePage = (type: string) => {
    type === 'prev'
      ? params.set('page', (parseInt(currentPage) - 1).toString())
      : params.set('page', (parseInt(currentPage) + 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const maxPageNum = 5; // Maximum page numbers to display at once
  const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible

  let activePages = pageNumbers.slice(
    Math.max(0, parseInt(currentPage) - 1 - pageNumLimit),
    Math.min(parseInt(currentPage) - 1 + pageNumLimit + 1, pageNumbers.length)
  );

  const hasPrev = itemPerPage * (parseInt(currentPage) - 1) > 0;
  const hasNext =
    itemPerPage * (parseInt(currentPage) - 1) + itemPerPage < count.totalItems;
  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={
          parseInt(currentPage) === page ? 'bg-neutral-100 rounded-md' : ''
        }
      >
        <PaginationLink onClick={() => params.set('page', page.toString())}>
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    // Add ellipsis at the start if necessary
    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => params.set('page', (activePages[0] - 1).toString())}
        />
      );
    }

    // Add ellipsis at the end if necessary
    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            params.set(
              'page',
              (activePages[activePages.length - 1] + 1).toString()
            )
          }
        />
      );
    }

    return renderedPages;
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              className="h-8 gap-1"
              size="sm"
              variant="outline"
              onClick={() => handleChangePage('prev')}
              disabled={!hasPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Previous
              </span>
            </Button>
          </PaginationItem>
          {renderPages()}
          <PaginationItem>
            <Button
              className="h-8 gap-1"
              size="sm"
              variant="outline"
              onClick={() => handleChangePage('next')}
              disabled={!hasNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Next
              </span>
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationFooter;
