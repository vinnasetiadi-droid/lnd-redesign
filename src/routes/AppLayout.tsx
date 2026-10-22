import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { BackgroundTaskProvider } from '@/contexts/BackgroundTaskContext';
import { BackgroundTaskToast } from '@/components/common/BackgroundTaskToast';
import { CourseGenerationProvider } from '@/contexts/CourseGenerationContext';
import { CourseGenerationToast } from '@/components/common/CourseGenerationToast';

// The NISA wave assistant at the bottom of the page is left out of this mockup copy.
export function AppLayout() {
  return (
    <BackgroundTaskProvider>
      <CourseGenerationProvider>
        <Outlet />
        <Toaster />
        <BackgroundTaskToast />
        <CourseGenerationToast />
      </CourseGenerationProvider>
    </BackgroundTaskProvider>
  );
}
