import React, { createContext, useState, ReactNode } from "react";

interface CourseCardViewContextType {
  courseCardView: boolean;
  toggleCourseCardView: () => void;
}

export const CourseCardViewContext = createContext<CourseCardViewContextType>({
  courseCardView: true,
  toggleCourseCardView: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const CourseCardViewProvider = ({ children }: ProviderProps) => {
  const [courseCardView, setCourseCardView] = useState(true);
  const toggleCourseCardView = () => setCourseCardView(!courseCardView);

  return (
    <CourseCardViewContext.Provider
      value={{ courseCardView, toggleCourseCardView }}
    >
      {children}
    </CourseCardViewContext.Provider>
  );
};
