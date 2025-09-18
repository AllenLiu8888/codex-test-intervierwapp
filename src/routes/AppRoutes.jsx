import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import InterviewsPage from '../pages/interviews/InterviewsPage.jsx';
import InterviewEditorPage from '../pages/interviews/InterviewEditorPage.jsx';
import QuestionsPage from '../pages/questions/QuestionsPage.jsx';
import QuestionEditorPage from '../pages/questions/QuestionEditorPage.jsx';
import ApplicantsPage from '../pages/applicants/ApplicantsPage.jsx';
import ApplicantEditorPage from '../pages/applicants/ApplicantEditorPage.jsx';
import TakeInterviewLanding from '../pages/take-interview/TakeInterviewLanding.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="interviews">
          <Route index element={<InterviewsPage />} />
          <Route path="new" element={<InterviewEditorPage />} />
          <Route path=":id/edit" element={<InterviewEditorPage />} />
        </Route>
        <Route path="questions">
          <Route index element={<QuestionsPage />} />
          <Route path="new" element={<QuestionEditorPage />} />
          <Route path=":id/edit" element={<QuestionEditorPage />} />
        </Route>
        <Route path="applicants">
          <Route index element={<ApplicantsPage />} />
          <Route path="new" element={<ApplicantEditorPage />} />
          <Route path=":id/edit" element={<ApplicantEditorPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/take/:token" element={<TakeInterviewLanding />} />
    </Routes>
  );
}
