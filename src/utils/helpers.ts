import { StoryBlock } from '@/lib/types';

export function extractStoryText(story: StoryBlock[] | null): string {
    if (!story || !Array.isArray(story)) return '';

    let text = '';
    story.forEach(block => {
        if (block.type === 'paragraph' && block.children) {
            block.children.forEach(child => {
                if (child.type === 'text' && child.text) {
                    text += child.text + ' ';
                }
            });
        }
    });
    return text.trim();
}

export function formatDate(dateString: string | null): string {
    if (!dateString) return 'Date not set';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function getCategoryColor(category: string | null): string {
    const colors: Record<string, string> = {
        'Childhood': 'bg-orange-500',
        'Elementary School': 'bg-green-500',
        'High School': 'bg-blue-500',
        'College': 'bg-purple-500',
    };
    return colors[category || ''] || 'bg-gray-500';
}

export function getMoodEmoji(mood: string | null): string {
    const emojis: Record<string, string> = {
        'Happy': '😊',
        'Reflective': '🤔',
        'Challenging': '💪',
        'Milestone': '🎯',
        'Nostalgic': '🌅',
        'Grateful': '🙏',
        'Adventurous': '🚀',
    };
    return emojis[mood || ''] || '';
}
