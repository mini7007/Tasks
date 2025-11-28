# [eyeTasks] - Simplify Your Tasks and Challenges

Welcome to eyeTasks, your all-in-one solution for seamless task management and conquering challenges. Enjoy a beautiful UI, effortless task handling, and unique features designed to enhance your productivity without the hassle of sign-ups.

## Features

### 1. No Sign-up Required (saving data locally)🚀

Your data, your rules! iTasks prioritizes your privacy by saving data locally, ensuring a secure and seamless experience without the need for sign-ups or sign-ins.

### 2. Beautiful UI with Easy Task Management 🎨

Enjoy a visually stunning user interface that makes task management a breeze. Easily add, edit, and delete tasks, ensuring a delightful user experience.

### 3. Challenge Yourself 🏆

Set challenges to elevate your productivity! Whether it's a 7-day project or another goal, iTasks helps you turn challenges into achievements.

### 4. Easy Management, No Pain 🤯

Experience task and challenge management without the headache. iTasks streamlines the process, making productivity enjoyable and stress-free.

### 5. Lightweight Jira-like Fields 🔧

Want Jira features without the complexity? iTasks now supports a few lightweight, Jira-like task fields while keeping the UI simple:

- Type: Story / Task / Bug / Improvement
- Assignee: Small, single-person field (name or initials)
- Due date: Choose a date (uses a native date input)
- Estimate / Story points: Simple integer value

These fields are optional and saved locally — they give you essential project-tracking power without the overhead of full Jira complexity.

### 6. Export: CSV & PDF 🗂️

You can now export your tasks (the currently filtered view) as CSV for spreadsheets or as a printable PDF (opens a printable view and uses the browser Print -> Save as PDF flow). The printable view opens in a new tab and automatically triggers the print dialog. If your browser blocks popups, the app will open the printable HTML as a fallback so you can still save or print manually.

## Getting Started

1. Visit [iTasks] in your web browser.

2. Start managing your tasks and challenges effortlessly!

### Gemini tools setup

If you'd like the small AI-powered tools (Documentation generator, Task suggestions, SEO blurb) to work locally you must set your Gemini (Generative AI) API key in an environment variable named `GEMINI_API_KEY`.

Example (.env.local):

```
GEMINI_API_KEY=your_api_key_here
# optionally override model
GEMINI_MODEL=text-bison-001
```

The app uses a server-side API route (`/api/gemini/generate`) that proxies requests to the Generative API so your key is never exposed to the browser.

### New: Categories, Reminders, Templates & Progress

This workspace now includes additional productivity features that help create structure and increase engagement:

- Categories: group tasks into Work, Personal, Study, and Fitness.
- Reminders: set a reminder (datetime) for a task — the app will try to show a browser notification when the reminder fires (notification permission required).
- Templates: import ready-made templates (morning routine, exam study plan, job search checklist, fitness checklist) with one click.
- Progress tracking: tasks list shows a completion count and a small progress bar.

### New: Urgent / Critical tasks (Overdue)

- If a task's Due Date or Reminder timestamp is in the past the app marks it as Overdue and moves it to the Home page 'Urgent' section.
- Tasks are grouped into:
  - 🔥 Urgent Tasks — recently overdue
  - 🚨 Critical Tasks — overdue by 3+ days
- Overdue tasks show a human-readable delay (e.g., "Delayed by 3 hours") that dynamically updates every minute while the app is open.
- Resolve or Snooze overdue tasks directly from the Home page; the app stores the change and the task will be removed from the urgent list.

Note: Reminder delivery remains a local/browser behavior (setTimeout in the running tab) — the app does not rely on any external push service.

These features are local-first and stored in `localStorage`.

That's it! No need to clone the repository or open index.html manually. Dive into iTasks and boost your productivity today! 🚀 #iTasks #ProductivityRevolution

## How to Contribute

We welcome contributions from the community! To contribute to iTasks, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them.
   ```bash
   git commit -m "Add your feature or bug fix description"
   ```
4. Push your changes to your fork.
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request on the main repository.

## License

This project is open source and available under the [MIT] License. Feel free to use, modify, and share!
