import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Schedule from "./pages/Schedule";
import ImportantDates from "./pages/ImportantDates";
import Speakers from "./pages/Speakers";
import PlenarySpeakers from "./pages/PlenarySpeakers";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/NotificationsPage";
import Sponsorship from "./pages/Sponsorship";
import Committee from "./pages/Committee";
import Footer from "./components/Footer";
import "./App.css";
import SubmitPaper from "./pages/SubmitPaper";
import Admin from "./pages/Admin";
import SubmitFullPaper from "./pages/SubmitFullPaper";
import UserDetailsPage from "./components/admin/UserDetailsPage";
import PaperDetailsPage from "./components/admin/PaperDetailsPage";
import SubmissionHistoryModal from "./components/admin/SubmissionHistoryModal";
import Brouchure from "./pages/Brouchure";
import ExtendedAbstractFormat from "./pages/ExtendedAbstractFormat";
import FullLengthPaperFormat from "./pages/FullLengthPaperFormat";
import PaymentProcedure from "./pages/PaymentProcedure";
import Sponsors from "./pages/Sponsors";
import BookOfAbstracts from "./pages/BookOfAbstracts";

function App() {
  return (
    <AuthProvider>
      <Router basename="/ictacem2025">
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />

              {/* Event routes */}
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/important-dates" element={<ImportantDates />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/plenary-speakers" element={<PlenarySpeakers />} />

              {/* Participation routes */}
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:resettoken"
                element={<ResetPassword />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/sponsorship" element={<Sponsorship />} />

              <Route path="/submit" element={<SubmitPaper />} />
              <Route
                path="/submit-full-paper/:paperId"
                element={<SubmitFullPaper />}
              />

              {/* Info routes */}
              <Route path="/brochure" element={<Brouchure />} />
              <Route
                path="/extended-abstract-format"
                element={<ExtendedAbstractFormat />}
              />
              <Route
                path="/full-length-paper-format"
                element={<FullLengthPaperFormat />}
              />
              <Route path="/payment-procedure" element={<PaymentProcedure />} />
              <Route path="/book-of-abstracts" element={<BookOfAbstracts />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/committee" element={<Committee />} />

              {/* Admin routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/user/:userId" element={<UserDetailsPage />} />
              <Route
                path="/admin/paper/:paperId"
                element={<PaperDetailsPage />}
              />
            </Routes>
          </main>
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
