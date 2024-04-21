import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ActivitySquare } from 'lucide-react';
import Link from 'next/link';

export default function DashboardDropdownItem() {
  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/files">
          <DropdownMenuItem className="cursor-pointer">
            <ActivitySquare className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
    </>
  );
}
