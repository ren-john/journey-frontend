'use client';

import { JournalEntry } from '@/lib/types';
import { extractStoryText, formatDate, getCategoryColor, getMoodEmoji } from '@/utils/helpers';
import { API_URL } from '@/lib/api';
import { useState } from 'react';
import Image from 'next/image';

interface EntryCardProps {
    entry: JournalEntry;
    index: number;
}

export default function EntryCard({ entry, index }: EntryCardProps) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const isEven = index % 2 === 0;
    const storyText = extractStoryText(entry.Story);

    return (
        <>
            <div
                className={`
          relative bg-white rounded-xl shadow-lg p-8 mb-12
          transition-all duration-300 hover:shadow-xl hover:-translate-y-1
          ${isEven ? 'md:mr-auto md:ml-0' : 'md:ml-auto md:mr-0'}
          w-full md:w-[45%]
        `}
            >
                {/* Timeline dot */}
                <div
                    className={`
            absolute top-8 w-5 h-5 bg-purple-600 rounded-full border-4 border-white
            shadow-md
            ${isEven ? 'md:-right-[42px]' : 'md:-left-[42px]'}
            -left-[30px] hidden md:block
          `}
                />

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {entry.Category && (
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getCategoryColor(entry.Category)}`}>
                            {entry.Category}
                        </span>
                    )}
                    {entry.Mood && (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                            {getMoodEmoji(entry.Mood)} {entry.Mood}
                        </span>
                    )}
                    {entry.Photos && entry.Photos.length > 0 && (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                            📸 {entry.Photos.length} photo{entry.Photos.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Date */}
                <div className="text-sm text-gray-500 mb-2 font-medium">
                    {formatDate(entry.Date)}
                    {entry.Age && <span className="ml-2">• Age {entry.Age}</span>}
                    {entry.Location && <span className="ml-2">• 📍 {entry.Location}</span>}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3 font-serif">
                    {entry.Title}
                </h3>

                {/* Story Preview */}
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {storyText}
                </p>

                {/* Photos grid */}
                {entry.Photos && entry.Photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {entry.Photos.slice(0, 2).map((photo) => {
                            const rawUrl = photo.formats?.medium?.url || photo.url;
                            const imageUrl = rawUrl.startsWith('http') ? rawUrl : `${API_URL}${rawUrl}`;

                            return (
                                <div
                                    key={photo.id}
                                    className="relative h-32 rounded-lg overflow-hidden cursor-pointer"
                                    onClick={() => setLightboxImage(imageUrl)}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={photo.alternativeText || photo.name}
                                        fill
                                        unoptimized
                                        className="object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                    <a
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded hover:bg-black/70 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Check URL
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="relative w-full max-w-4xl h-[80vh]">
                        <Image
                            src={lightboxImage}
                            alt="Full size"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
