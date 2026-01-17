import React from 'react'

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-4xl px-2 sm:px-4">
        {/* Cover Photo Skeleton */}
        <div className="relative">
          <div className="h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-b-xl sm:rounded-b-2xl overflow-hidden shadow-lg animate-pulse bg-[length:200%_100%] animate-shimmer">
          </div>

          {/* Profile Picture Skeleton */}
          <div className="absolute -bottom-12 sm:-bottom-14 md:-bottom-16 left-4 sm:left-6 md:left-8">
            <div className="size-24 sm:size-28 md:size-32 rounded-full border-2 sm:border-4 border-white shadow-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] animate-shimmer">
            </div>
          </div>
        </div>

        {/* Profile Info Section Skeleton */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mt-14 sm:mt-16 md:mt-20 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1 w-full">
              {/* Name Skeleton */}
              <div className="h-8 sm:h-9 md:h-10 w-48 sm:w-56 md:w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>

              {/* Username Skeleton */}
              <div className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mt-3 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>

              {/* Stats Skeleton */}
              <div className="flex gap-10 mt-8">
                <div className="text-center">
                  <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                </div>
                <div className="text-center">
                  <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                </div>
                <div className="text-center">
                  <div className="h-8 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="w-full sm:w-auto">
              <div className="h-9 sm:h-10 w-full sm:w-28 md:w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Tabs Section Skeleton */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mt-4 sm:mt-6 md:mt-8 mb-6 sm:mb-8 md:mb-12 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <div className="flex-1 py-3 sm:py-4 md:py-5 flex justify-center">
              <div className="h-5 sm:h-6 w-12 sm:w-14 md:w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            </div>
            <div className="flex-1 py-3 sm:py-4 md:py-5 flex justify-center">
              <div className="h-5 sm:h-6 w-12 sm:w-14 md:w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
            </div>
          </div>

          {/* Posts Content Skeleton */}
          <div className="p-4 sm:p-6 md:p-8 bg-gray-50/50">
            {/* Post Card Skeleton 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="size-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>

                <div className="flex-1">
                  {/* Name and time */}
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-4"></div>

                  {/* Post content */}
                  <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-4/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-3/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Post Card Skeleton 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="size-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>

                <div className="flex-1">
                  {/* Name and time */}
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-4"></div>

                  {/* Post content */}
                  <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-5/6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Post Card Skeleton 3 */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="size-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse bg-[length:200%_100%] animate-shimmer"></div>

                <div className="flex-1">
                  {/* Name and time */}
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-4"></div>

                  {/* Post content */}
                  <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer mb-2"></div>
                  <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse bg-[length:200%_100%] animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  )
}
