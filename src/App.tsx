import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VarkTest from "./pages/VarkTest";
import BrowseCourses from "./pages/BrowseCourses";
import CreateCourse from "./pages/CreateCourse";
import Palace from "./pages/Palace";
import CourseManage from "./pages/CourseManage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/vark-test" element={<VarkTest />} />
              <Route path="/browse-courses" element={<BrowseCourses />} />
              <Route path="/create-course" element={<CreateCourse />} />
              <Route path="/palace/:courseId" element={<Palace />} />
              <Route path="/course/:courseId" element={<CourseManage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
