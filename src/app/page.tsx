import { getEntries } from '@/lib/api';
import EntryCard from '@/components/EntryCard';
import PhaseHeader from '@/components/PhaseHeader';
import { JournalEntry, LifePhase } from '@/lib/types';
import { Sparkles, Heart } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

const lifePhases: LifePhase[] = [
  { name: 'Childhood', ageRange: 'Ages 0-5', color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { name: 'Elementary School', ageRange: 'Ages 6-11', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'High School', ageRange: 'Ages 12-17', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { name: 'College', ageRange: 'Ages 18-22', color: 'text-amber-600', bgColor: 'bg-amber-50' }
];

export default async function Home() {
  let entries: JournalEntry[] = [];
  let error = null;

  try {
    entries = await getEntries();
  } catch (err) {
    console.error('Failed to fetch journal entries:', err);
    error = 'Unable to load journal entries. Please ensure the backend is running and accessible.';
  }

  // Group entries by category from Strapi
  const groupedEntries = entries.reduce((acc, entry) => {
    const category = entry.Category?.toLowerCase() || 'uncategorized';

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  // Sort entries within each category by date (oldest to newest)
  Object.keys(groupedEntries).forEach(category => {
    groupedEntries[category].sort((a, b) => {
      const dateA = a.Date ? new Date(a.Date).getTime() : 0;
      const dateB = b.Date ? new Date(b.Date).getTime() : 0;
      return dateA - dateB; // Ascending order (oldest first)
    });
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h1 className="text-2xl font-extrabold text-gray-900">My Life Journey</h1>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-sm text-gray-600">From childhood wonder to college dreams</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="rounded-md bg-red-50 p-4 mb-8 mx-auto max-w-2xl border border-red-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-1 text-xs text-red-500">Check console for details.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Journey Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
              {lifePhases.map((phase, idx) => {
                const phaseEntries = groupedEntries[phase.name.toLowerCase()] || [];
                return (
                  <div key={idx} className={`${phase.bgColor} rounded-xl p-4 text-center border-2 ${phase.color.replace('text-', 'border-')}`}>
                    <p className={`text-2xl font-bold mb-1 ${phase.color}`}>{phaseEntries.length}</p>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">{phase.name}</p>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical gradient line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 via-blue-300 via-purple-300 to-amber-300" />

              {/* Entries grouped by phase */}
              <div>
                {lifePhases.map((phase, phaseIdx) => {
                  const phaseEntries = groupedEntries[phase.name.toLowerCase()] || [];
                  if (phaseEntries.length === 0) return null;

                  return (
                    <div key={phase.name}>
                      <PhaseHeader phase={phase} index={phaseIdx} />
                      {phaseEntries.map((entry, idx) => (
                        <EntryCard key={entry.id} entry={entry} index={idx} />
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {entries.length === 0 && (
                <div className="pl-16 text-center py-12">
                  <p className="text-gray-500 italic">No journal entries found yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Start adding memories to your life journey!</p>
                </div>
              )}

              {/* Journey End */}
              {entries.length > 0 && (
                <div className="pl-16 pt-8 pb-4">
                  <div className="text-center py-8 bg-white/80 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-200 via-purple-200 to-amber-200 rounded-full mb-3">
                      <Sparkles className="w-5 h-5 text-gray-700" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">The journey continues...</p>
                    <p className="text-xs text-gray-400 mt-1">More chapters to come</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
