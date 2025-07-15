export default function getAnnouncementTemplate(template: string, date: Date) {
  const templates = {
    no_class: {
      title: "Class Suspension Notice",
      description: `Dear students, please be informed that there will be no classes on ${date.toDateString()}. Stay safe and updated.`,
    },
    emergency: {
      title: "Emergency Announcement",
      description:
        "This is an urgent notice. Please follow safety protocols and await further instructions.",
    },
    reminder_assignment: {
      title: "Assignment Reminder",
      description:
        "This is a reminder to submit your assignment on time. Please check the deadline and complete your work as soon as possible.",
    },
    reminder_quiz: {
      title: "Quiz Reminder",
      description:
        "Heads up! We have a quiz coming up. Please review your notes and be prepared.",
    },
  };

  const selectedTemplate = templates[template as keyof typeof templates];

  if (!selectedTemplate) {
    return {
      title: "",
      description: "",
    };
  }

  return {
    title: selectedTemplate.title,
    description: selectedTemplate.description,
  };
}
