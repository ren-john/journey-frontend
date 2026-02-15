import { getEntries } from '@/lib/api';
import EntryCard from '@/components/EntryCard';
import { JournalEntry } from '@/lib/types';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  let entries: JournalEntry[] = [];
  let error = null;

  try {
    entries = await getEntries();
  } catch (err) {
    console.error('Failed to fetch journal entries:', err);
    error = 'Unable to load journal entries. Please ensure the backend is running and accessible.';
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl font-serif">
            Life Journey
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A collection of memories, milestones, and reflections.
          </p>
        </header>

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
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden md:block" />

            {/* Entries List */}
            <div className="relative">
              {entries.map((entry, index) => (
                <EntryCard key={entry.id} entry={entry} index={index} />
              ))}

              {entries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 italic">No journal entries found yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
