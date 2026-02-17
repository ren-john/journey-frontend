'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { JournalEntry } from '@/lib/types';
import { API_URL } from '@/lib/api';
import Image from 'next/image';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';

interface EntryCardProps {
    entry: JournalEntry;
    index: number;
}

const phaseColors = {
    childhood: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-600',
        dot: 'bg-pink-400'
    },
    'elementary school': {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        dot: 'bg-blue-400'
    },
    'high school': {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        dot: 'bg-purple-400'
    },
    college: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-600',
        dot: 'bg-amber-400'
    }
};

// Helper function to extract story text
function extractStoryText(story: any): string {
    if (!story) return '';
    if (Array.isArray(story)) {
        return story
            .map(block =>
                block.children?.map((child: any) => child.text).join('') || ''
            )
            .join(' ');
    }
    return '';
}

// Helper function to format year from date
function getYear(date: string | null): string {
    if (!date) return '';
    return new Date(date).getFullYear().toString();
}

export default function EntryCard({ entry, index }: EntryCardProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Use Category from Strapi directly, default to 'childhood' if not set
    const category = entry.Category?.toLowerCase() || 'childhood';
    const phase = (category in phaseColors ? category : 'childhood') as keyof typeof phaseColors;
    const colors = phaseColors[phase];
    const storyText = extractStoryText(entry.Story);
    const year = getYear(entry.Date);

    // Prepare ALL images array (not just first 4)
    const allImages = entry.Photos?.map(photo => {
        const rawUrl = photo.formats?.large?.url || photo.formats?.medium?.url || photo.url;
        return rawUrl.startsWith('http') ? rawUrl : `${API_URL}${rawUrl}`;
    }) || [];

    // Preview images (first 4)
    const previewImages = allImages.slice(0, 4);

    const openLightbox = (imageIndex: number) => {
        setCurrentImageIndex(imageIndex);
        setLightboxOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative pl-16 pb-12"
            >
                {/* Age Badge */}
                <div className="absolute left-0 top-0">
                    <div className={`w-12 h-12 ${colors.bg} ${colors.border} border-2 rounded-full flex items-center justify-center`}>
                        <span className={`font-semibold ${colors.text}`}>{entry.Age || '?'}</span>
                    </div>
                </div>

                {/* Content Card */}
                <div className={`${colors.bg} ${colors.border} border rounded-2xl overflow-hidden`}>
                    {/* Photo Collage */}
                    {previewImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-1 p-1 bg-white relative">
                            {previewImages.map((image, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => openLightbox(idx)}
                                    className={`
                                        ${previewImages.length === 1 ? 'col-span-2 aspect-video' : ''}
                                        ${previewImages.length === 2 ? 'aspect-square' : ''}
                                        ${previewImages.length === 3 && idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}
                                        ${previewImages.length >= 4 ? 'aspect-square' : ''}
                                        overflow-hidden rounded-lg relative cursor-pointer group
                                    `}
                                >
                                    <Image
                                        src={image}
                                        alt={`Memory ${idx + 1}`}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                                            Click to zoom
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* More photos indicator */}
                            {allImages.length > 4 && (
                                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                    +{allImages.length - 4} more
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-medium px-2 py-1 ${colors.bg} ${colors.text} rounded-full uppercase tracking-wide`}>
                                        {phase}
                                    </span>
                                    {year && <span className="text-sm text-gray-500">{year}</span>}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {entry.Title}
                                </h3>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {storyText}
                        </p>

                        {/* Location */}
                        {entry.Location && (
                            <div className="space-y-1.5 mb-4">
                                <div className="flex items-start gap-2">
                                    <div className={`w-1.5 h-1.5 ${colors.dot} rounded-full mt-1.5 flex-shrink-0`} />
                                    <span className="text-sm text-gray-600">📍 {entry.Location}</span>
                                </div>
                            </div>
                        )}

                        {/* View Album Button */}
                        {allImages.length > 0 && (
                            <button
                                onClick={() => openLightbox(0)}
                                className={`flex items-center gap-2 ${colors.bg} ${colors.text} px-4 py-2 rounded-lg hover:opacity-80 transition-opacity text-sm font-medium border ${colors.border}`}
                            >
                                <Images className="w-4 h-4" />
                                View Album ({allImages.length} {allImages.length === 1 ? 'photo' : 'photos'})
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Image counter */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                            {currentImageIndex + 1} / {allImages.length}
                        </div>

                        {/* Main image */}
                        <div
                            className="relative w-full h-full flex items-center justify-center p-16"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={allImages[currentImageIndex]}
                                    alt={`Photo ${currentImageIndex + 1}`}
                                    fill
                                    unoptimized
                                    className="object-contain"
                                />
                            </motion.div>
                        </div>

                        {/* Navigation buttons */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}

                        {/* Thumbnail strip */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-black/50 rounded-lg">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
