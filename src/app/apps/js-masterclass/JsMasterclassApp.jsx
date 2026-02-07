import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import LessonView from './LessonView';
import usePersistentState from '../../../hooks/usePersistentState';
import { useToast } from '../../../hooks/useToast';

const JsMasterclassApp = () => {
  const [course, setCourse] = useState(null);
  const [currentLessonId, setCurrentLessonId] = usePersistentState(
    'js-masterclass-last-lesson',
    null,
  );
  const [completedLessons, setCompletedLessons] = usePersistentState(
    'js-masterclass-completed',
    [],
  );
  const { addToast } = useToast();

  useEffect(() => {
    console.log('Fetching course data...');
    fetch('/apps/js-masterclass/course.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Course data loaded:', data);
        setCourse(data);

        // Validation Logic
        let isValidLesson = false;
        if (currentLessonId) {
          // Check if the saved ID actually exists in the new data
          for (const module of data.modules) {
            if (module.lessons.find((l) => l.id === currentLessonId)) {
              isValidLesson = true;
              break;
            }
          }
        }

        if (
          !isValidLesson &&
          data.modules.length > 0 &&
          data.modules[0].lessons.length > 0
        ) {
          console.log('Invalid or missing lesson ID, resetting to start.');
          setCurrentLessonId(data.modules[0].lessons[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load course:', err);
        addToast({
          title: 'SYSTEM_ERROR',
          message: 'FAILED_TO_LOAD_DATA_STREAM',
          type: 'error',
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLessonComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
      addToast({
        title: 'PROTOCOL_COMPLETE',
        message: 'DATA_SAVED_TO_LOCAL_MEMORY',
        type: 'success', // Assuming the toast component handles variants or defaults
      });

      // Auto-advance logic could go here
    }
  };

  const handleResetCourse = () => {
    setCompletedLessons([]);
    if (
      course &&
      course.modules.length > 0 &&
      course.modules[0].lessons.length > 0
    ) {
      setCurrentLessonId(course.modules[0].lessons[0].id);
    }
    addToast({
      title: 'SYSTEM_RESET',
      message: 'PROTOCOL_PROGRESS_WIPED',
      type: 'techno',
    });
  };

  // Helper to find lesson object by ID
  const getCurrentLesson = () => {
    if (!course || !currentLessonId) return null;
    for (const module of course.modules) {
      const lesson = module.lessons.find((l) => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#050505]">
      <Sidebar
        course={course}
        currentLessonId={currentLessonId}
        onSelectLesson={handleLessonSelect}
        completedLessons={completedLessons}
        onResetCourse={handleResetCourse}
      />
      <main className="flex-grow overflow-y-auto bg-[#050505] p-8 md:p-16 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <LessonView
          lesson={getCurrentLesson()}
          onComplete={handleLessonComplete}
        />
      </main>
    </div>
  );
};

export default JsMasterclassApp;
