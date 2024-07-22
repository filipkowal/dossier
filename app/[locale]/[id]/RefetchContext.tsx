"use client";
import { createContext, useContext, useState } from "react";

const RefetchContext = createContext({
  isRefetching: false,
  startRefetch: () => {},
  endRefetch: () => {},
});

export const useRefetch = () => {
  return useContext(RefetchContext);
};

export const RefetchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isRefetching, setIsRefetching] = useState(false);

  const startRefetch = () => setIsRefetching(true);
  const endRefetch = () => setIsRefetching(false);

  return (
    <RefetchContext.Provider value={{ isRefetching, startRefetch, endRefetch }}>
      {children}
    </RefetchContext.Provider>
  );
};
