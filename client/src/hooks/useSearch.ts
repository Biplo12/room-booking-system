import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = pathname.split("?")[1];

  const [searchTerm, setSearchTerm] = useState(searchParams || "");

  const debouncedSearchTerm = useDebounce(searchTerm);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedSearchTerm, pathname, router, searchParams]);

  return { searchTerm, setSearchTerm };
}
