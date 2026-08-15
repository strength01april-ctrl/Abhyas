import { useCallback, useEffect, useState } from 'react';
import type {
  ActivityType,
  QuestionCount,
  QuestionResult,
  StudyMaterial,
  Subject,
} from '@/types';
import { storage } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import { HomeScreen, HowToUseModal } from '@/screens/HomeScreen';
import { MaterialsScreen } from '@/screens/MaterialsScreen';
import { MaterialPicker } from '@/screens/MaterialPicker';
import { ActivitySelectScreen } from '@/screens/ActivitySelectScreen';
import { CountSelectScreen } from '@/screens/CountSelectScreen';
import { SessionScreen } from '@/screens/SessionScreen';
import { ResultsScreen } from '@/screens/ResultsScreen';

type View =
  | { name: 'home' }
  | { name: 'materials' }
  | { name: 'material-picker'; subject: Subject }
  | { name: 'activity'; subject: Subject; material: StudyMaterial }
  | { name: 'count'; subject: Subject; material: StudyMaterial; activity: ActivityType }
  | { name: 'session'; subject: Subject; material: StudyMaterial; activity: ActivityType; count: QuestionCount }
  | { name: 'results'; subject: Subject; material: StudyMaterial; activity: ActivityType; results: QuestionResult[] };

function App() {
  const [view, setView] = useState<View>({ name: 'home' });
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [howToOpen, setHowToOpen] = useState(false);

  const refreshMaterials = useCallback(() => {
    setMaterials(storage.loadMaterials());
  }, []);

  useEffect(() => {
    refreshMaterials();
  }, [refreshMaterials]);

  const goHome = () => setView({ name: 'home' });

  const handleSelectSubject = (subject: Subject) => {
    setView({ name: 'material-picker', subject });
  };

  const handlePickMaterial = (subject: Subject, material: StudyMaterial) => {
    setView({ name: 'activity', subject, material });
  };

  const handleSelectActivity = (subject: Subject, material: StudyMaterial, activity: ActivityType) => {
    setView({ name: 'count', subject, material, activity });
  };

  const handleSelectCount = (
    subject: Subject,
    material: StudyMaterial,
    activity: ActivityType,
    count: QuestionCount,
  ) => {
    setView({ name: 'session', subject, material, activity, count });
  };

  const handleSessionComplete = (
    subject: Subject,
    material: StudyMaterial,
    activity: ActivityType,
    results: QuestionResult[],
  ) => {
    setView({ name: 'results', subject, material, activity, results });
  };

  const handleRetry = (view: Extract<View, { name: 'results' }>) => {
    setView({ name: 'count', subject: view.subject, material: view.material, activity: view.activity });
  };

  const rightSlot =
    view.name === 'activity' || view.name === 'count' || view.name === 'session'
      ? <span className="chip bg-brand-50 text-brand-600 border border-brand-100 hidden sm:inline-flex">{view.subject.name}</span>
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <AppHeader
        onHome={goHome}
        onHowToUse={() => setHowToOpen(true)}
        onMaterials={() => setView({ name: 'materials' })}
        rightSlot={rightSlot}
      />

      <main className="flex-1">
        {view.name === 'home' && (
          <HomeScreen
            onSelectSubject={handleSelectSubject}
            onOpenMaterials={() => setView({ name: 'materials' })}
          />
        )}

        {view.name === 'materials' && (
          <MaterialsScreen
            materials={materials}
            onChange={refreshMaterials}
            onBack={goHome}
          />
        )}

        {view.name === 'material-picker' && (
          <MaterialPicker
            subject={view.subject}
            materials={materials}
            onPick={(m) => handlePickMaterial(view.subject, m)}
            onUpload={() => setView({ name: 'materials' })}
            onBack={goHome}
          />
        )}

        {view.name === 'activity' && (
          <ActivitySelectScreen
            subject={view.subject}
            material={view.material}
            onSelect={(a) => handleSelectActivity(view.subject, view.material, a)}
            onBack={() => setView({ name: 'material-picker', subject: view.subject })}
            onChangeMaterial={() => setView({ name: 'material-picker', subject: view.subject })}
          />
        )}

        {view.name === 'count' && (
          <CountSelectScreen
            subject={view.subject}
            material={view.material}
            activity={view.activity}
            onSelect={(c) => handleSelectCount(view.subject, view.material, view.activity, c)}
            onBack={() => setView({ name: 'activity', subject: view.subject, material: view.material })}
          />
        )}

        {view.name === 'session' && (
          <SessionScreen
            subject={view.subject}
            material={view.material}
            activity={view.activity}
            count={view.count}
            onComplete={(results) =>
              handleSessionComplete(view.subject, view.material, view.activity, results)
            }
            onBack={() =>
              setView({ name: 'count', subject: view.subject, material: view.material, activity: view.activity })
            }
          />
        )}

        {view.name === 'results' && (
          <ResultsScreen
            subject={view.subject}
            material={view.material}
            activity={view.activity}
            results={view.results}
            onRetry={() => handleRetry(view)}
            onHome={goHome}
          />
        )}
      </main>

      <footer className="border-t border-cool-100 bg-ivory-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 text-center text-xs text-bluegrey-500">
          ABHYAS — Smart Study &amp; Revision Companion. Your materials stay on this device.
        </div>
      </footer>

      <HowToUseModal open={howToOpen} onClose={() => setHowToOpen(false)} />
    </div>
  );
}

export default App;
