import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-6 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="animate-pulse p-4">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-3 border-b border-gray-100 dark:border-gray-700">
        {Array.from({ length: cols }).map((_, j) => (
          <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8" />
    <div className="grid md:grid-cols-2 gap-12">
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-40" />
      </div>
    </div>
  </div>
);

export const ChatSkeleton = () => (
  <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 animate-pulse">
    <div className="h-16 bg-gray-200 dark:bg-gray-800" />
    <div className="flex-1 p-5 space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
        </div>
      ))}
    </div>
    <div className="h-16 bg-gray-200 dark:bg-gray-800" />
  </div>
);