# Testing Plan — Idea Planner

## How to use this document
- Work through each section in order
- Mark each test `[x]` pass or `[!]` fail (with a note)
- A section is complete only when all tests pass or failures are documented with a GitHub issue

**Prerequisites before starting:**
- [ ] `.env.local` is populated with valid credentials
- [ ] `supabase/schema.sql` has been run in Supabase SQL editor
- [ ] `npm run dev` is running at `http://localhost:3000`
- [ ] Gemini API key is valid and has free quota remaining

---

## 1. Dashboard

### 1.1 Empty state
- [ ] Navigate to `/` with no projects in the database
- [ ] "No ideas yet" empty state is displayed with a description
- [ ] "New idea" CTA button is present and links to `/projects/new`

### 1.2 Project cards
- [ ] Create 2–3 projects via the form, then return to `/`
- [ ] Each project appears as a card with its title visible
- [ ] Cards with a description show it truncated (no overflow)
- [ ] Cards without a description show no empty space for description
- [ ] "Updated X ago" timestamp is shown on each card
- [ ] Cards are ordered by most recently updated first

### 1.3 GitHub icon on card
- [ ] Create a project with a GitHub URL — card shows an external link icon
- [ ] Create a project without a GitHub URL — no icon shown
- [ ] Clicking the icon opens the GitHub URL in a new tab (does not navigate away)

### 1.4 AI summary indicator
- [ ] A project with a completed interview summary shows a ✦ sparkle icon
- [ ] A project without a summary shows no sparkle icon

### 1.5 Tag filter bar
- [ ] With no tags in the database, the tag filter bar is hidden
- [ ] After creating projects with tags, the filter bar appears with all unique tags
- [ ] Clicking a tag filters the grid to only matching projects
- [ ] The URL updates to `/?tag=<name>` when a tag is selected
- [ ] Clicking "All" clears the filter and shows all projects
- [ ] Navigating directly to `/?tag=web` pre-selects that tag
- [ ] Filtering to a tag with no matching projects shows the empty state

### 1.6 Navigation
- [ ] Clicking a project card navigates to `/projects/[id]`
- [ ] Clicking "Idea Planner" logo in nav returns to `/`
- [ ] Clicking "New idea" in nav goes to `/projects/new`

---

## 2. Create Project

### 2.1 Form validation
- [ ] Navigate to `/projects/new`
- [ ] Submit the form with an empty title — error message is shown, no network request made
- [ ] Fill in title only and submit — project is created successfully

### 2.2 Field behaviour
- [ ] Title field is auto-focused on page load
- [ ] Description field accepts multi-line text
- [ ] GitHub URL field rejects non-URL strings (browser native validation)
- [ ] GitHub URL field accepts a valid `https://github.com/...` URL

### 2.3 Tag input
- [ ] Click the tag input area and type a tag name then press Enter — tag chip appears
- [ ] Type a tag and press comma — tag chip appears
- [ ] Type a tag and press Enter — input clears, chip remains
- [ ] Press Backspace with an empty input — last tag chip is removed
- [ ] Duplicate tags cannot be added (typing an existing tag name and pressing Enter does nothing)
- [ ] Tags are displayed as lowercase

### 2.4 Tag autocomplete
- [ ] After creating a project with tag "web", start a new project and type "w" in the tag input
- [ ] A dropdown appears suggesting "web"
- [ ] Clicking a suggestion adds it as a chip and clears the input

### 2.5 Successful creation
- [ ] Fill all fields and submit — page navigates to `/projects/[id]` of the new project
- [ ] All entered values are visible on the detail page
- [ ] New project appears on the dashboard

### 2.6 Cancel
- [ ] Click Cancel on the new project form — navigates back to the previous page

---

## 3. Project Detail Page

### 3.1 Data display
- [ ] Title is displayed prominently
- [ ] Description is shown below title (if present)
- [ ] Tags appear as chips below the description
- [ ] GitHub link is shown with an icon and opens in a new tab
- [ ] "Updated X ago" timestamp is shown
- [ ] Edit and delete buttons are present

### 3.2 No optional fields
- [ ] For a project with no description, no empty space for it appears
- [ ] For a project with no GitHub URL, no GitHub chip appears
- [ ] For a project with no tags, no tag chips appear

### 3.3 Edit button
- [ ] Clicking Edit navigates to `/projects/[id]/edit`

### 3.4 Delete button
- [ ] Clicking the delete (trash) icon shows a browser confirm dialog
- [ ] Clicking Cancel in the dialog — project is NOT deleted, stays on detail page
- [ ] Clicking OK in the dialog — project is deleted, redirects to `/`
- [ ] Deleted project no longer appears on the dashboard
- [ ] Deleted project's tags are cleaned up (check in Supabase dashboard: `project_tags` rows removed)

---

## 4. Edit Project

### 4.1 Pre-populated values
- [ ] Navigate to `/projects/[id]/edit` for an existing project
- [ ] Title field is pre-filled with the current title
- [ ] Description field is pre-filled
- [ ] GitHub URL field is pre-filled
- [ ] Existing tags are shown as chips in the tag input

### 4.2 Editing
- [ ] Change the title and save — detail page shows the updated title
- [ ] Remove all tags and save — detail page shows no tags; dashboard card shows no tags
- [ ] Add new tags and save — new tags appear and are available in the tag filter
- [ ] Clear the GitHub URL and save — GitHub link no longer shown on detail page

### 4.3 Cancel
- [ ] Click Cancel — navigates back without saving changes (original values intact)

---

## 5. Notes

### 5.1 Empty state
- [ ] A new project shows "No notes yet. Click Edit to add some." in the notes section

### 5.2 Editing
- [ ] Click "Edit" — textarea appears with existing notes (or empty)
- [ ] Type some notes and click Save — notes are saved and displayed
- [ ] Refresh the page — notes persist (confirmed from database)

### 5.3 Editing existing notes
- [ ] Click Edit on a project that already has notes — textarea is pre-filled with current notes
- [ ] Modify the text and save — updated notes are displayed

### 5.4 Cancel
- [ ] Click Edit, modify the text, then click Cancel — original notes are restored, no save

### 5.5 Long notes
- [ ] Save notes with 500+ characters — text is displayed without truncation or overflow

---

## 6. AI Interview

### 6.1 Start interview
- [ ] On a project detail page, click "Start Interview"
- [ ] Interview modal opens with a loading spinner briefly
- [ ] Gemini's opening question appears in the chat
- [ ] The "Finish" button is disabled (requires at least 3 messages)

### 6.2 Sending messages
- [ ] Type a response in the textarea and press Enter — message is sent
- [ ] User message appears right-aligned in an indigo bubble
- [ ] Gemini response streams in token-by-token (typing effect)
- [ ] Input is disabled while Gemini is responding
- [ ] Send button shows a spinner while Gemini is responding
- [ ] After Gemini responds, input re-enables and clears
- [ ] Shift+Enter inserts a newline in the input (does not send)

### 6.3 Multi-turn conversation
- [ ] Send 4–5 messages back and forth — full conversation history is visible
- [ ] Chat scrolls to the latest message automatically
- [ ] Each of Gemini's questions is on a different topic (problem → users → challenge → tech → timeline)
- [ ] After ~8 exchanges Gemini suggests finishing the interview

### 6.4 Finish interview
- [ ] After 3+ messages, click "Finish"
- [ ] Confirmation prompt appears: "Generate a summary from this conversation?"
- [ ] Click "Keep chatting" — confirmation dismissed, chat continues normally
- [ ] Click "Finish" again, then "Yes, generate summary"
- [ ] Loading state shown: "Generating your project summary…"
- [ ] On success: "Summary saved! Closing…" appears, then modal closes
- [ ] Project detail page reloads and shows the AI Summary panel

### 6.5 Summary content
- [ ] Summary panel shows all 7 fields: Problem, Target Users, Core Challenge, Tech Approach, Timeline, Next Steps, Open Questions
- [ ] Next Steps and Open Questions are rendered as bullet lists
- [ ] Summary content is relevant to the conversation that was held

### 6.6 Interview transcript
- [ ] "Interview transcript (N messages)" collapsible section is present on detail page
- [ ] Clicking it expands to show the full chat history
- [ ] User messages are right-aligned, Gemini messages are left-aligned
- [ ] Clicking again collapses it

### 6.7 Starting a new interview
- [ ] On a project that already has a summary, click "New interview"
- [ ] A new session is created (a second interview, not overwriting the first)
- [ ] Completing the new interview replaces the summary on the detail page with the latest one
- [ ] The transcript shown is from the latest session

### 6.8 Close without finishing
- [ ] Start an interview, send a few messages, then press Escape or click the × button
- [ ] Modal closes without generating a summary
- [ ] No summary panel appears on the detail page
- [ ] The partial conversation is NOT shown on the detail page (only completed sessions shown)

---

## 7. Error Handling

### 7.1 Invalid Gemini API key
- [ ] Set `GEMINI_API_KEY` to an invalid value in `.env.local`, restart dev server
- [ ] Start an interview and send a message
- [ ] An error is visible in the stream (does not hang or crash the page)
- [ ] Restore the valid key and restart

### 7.2 Network errors
- [ ] Start an interview, disconnect from the internet, send a message
- [ ] The UI handles the failure gracefully (no white screen or unhandled exception)

### 7.3 Missing Supabase credentials
- [ ] Remove `SUPABASE_SERVICE_ROLE_KEY`, restart dev server
- [ ] Attempt to create a project — an error response is returned (500), UI shows a message
- [ ] Restore the key and restart

### 7.4 Non-existent project
- [ ] Navigate to `/projects/00000000-0000-0000-0000-000000000000`
- [ ] Page redirects to `/` (not a white screen or unhandled error)

---

## 8. Data Integrity

### 8.1 Tag deduplication
- [ ] Create two projects both tagged "web"
- [ ] Check Supabase `tags` table — only one "web" row exists
- [ ] Both projects appear when filtering by "web"

### 8.2 Cascade delete
- [ ] Create a project with tags and a completed interview
- [ ] Delete the project
- [ ] Check Supabase: `project_tags` rows for that project are gone
- [ ] Check Supabase: `interview_sessions` rows for that project are gone
- [ ] The project row itself is gone from `projects`

### 8.3 Concurrent tag edits
- [ ] Edit a project and change its tags twice in quick succession
- [ ] Final tag state matches the last save (no stale tags left over)

---

## 9. Responsive Design

### 9.1 Mobile (375px)
- [ ] Dashboard cards stack in a single column
- [ ] Tag filter bar wraps onto multiple lines without overflow
- [ ] Project form fields are full width and usable
- [ ] Interview modal fills the screen with no horizontal scroll
- [ ] Chat input and send/finish buttons are accessible without zooming

### 9.2 Tablet (768px)
- [ ] Dashboard shows a 2-column card grid
- [ ] Nav bar elements are correctly spaced

### 9.3 Desktop (1280px+)
- [ ] Dashboard shows a 3-column card grid
- [ ] Detail page content is centered with comfortable max-width

### 9.4 Dark mode
- [ ] Switch OS to dark mode — the app switches to dark theme
- [ ] All text is readable (no white-on-white or black-on-black)
- [ ] Cards, modal, inputs, and badges all have correct dark backgrounds

---

## 10. Performance

### 10.1 Dashboard load
- [ ] With 10+ projects, dashboard loads in under 3 seconds on a local connection
- [ ] No layout shift after initial render (tags and cards load together)

### 10.2 Interview streaming
- [ ] First token appears within 3 seconds of sending a message
- [ ] Streaming feels smooth (no large jumps or freezes)

---

## 11. Deployment (Vercel)

### 11.1 Build
- [ ] `npm run build` completes with zero TypeScript errors locally
- [ ] Pushing to GitHub triggers a successful Vercel build
- [ ] No environment variable errors in Vercel build logs

### 11.2 Environment variables
- [ ] All 4 env vars are set in Vercel dashboard (Production + Preview + Development)
- [ ] The deployed app can create a project (confirms Supabase connection)
- [ ] The deployed app can run an interview (confirms Gemini connection)

### 11.3 Streaming on Vercel
- [ ] Interview chat streaming works on the deployed URL (not just locally)
- [ ] No timeout errors during a normal-length interview (~8 exchanges)

### 11.4 Supabase CORS
- [ ] No CORS errors in the browser console on the deployed domain
- [ ] (All DB calls go through Next.js API routes server-side, so this should be fine)

---

## Sign-off

| Section | Status | Notes |
|---|---|---|
| 1. Dashboard | | |
| 2. Create Project | | |
| 3. Project Detail | | |
| 4. Edit Project | | |
| 5. Notes | | |
| 6. AI Interview | | |
| 7. Error Handling | | |
| 8. Data Integrity | | |
| 9. Responsive Design | | |
| 10. Performance | | |
| 11. Deployment | | |

**Tested by:** ___________________  **Date:** ___________________
