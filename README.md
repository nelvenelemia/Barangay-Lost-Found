# Barangay Lost & Found

A one-page community web application that helps residents report lost belongings and share information about items they have found.

## Community problem

Lost and found information is often scattered across social media, group chats, and verbal announcements. Residents may have difficulty finding missing belongings or informing others about items they have found.

## Target users

Barangay residents.

## Functional requirement — FR-01

**Submit and View Lost and Found Items**

As a resident, I want to post and view lost or found items so that I can help locate missing belongings or return items to their owners.

### Acceptance criteria
- Residents can submit Lost or Found reports.
- Reports include item name, category, location, date, and description.
- Required fields are validated.
- Reports are saved in browser localStorage.
- Submitted reports appear in the listing and remain after refreshing.
- Residents can search and filter reports.

## Technology
- HTML
- CSS
- JavaScript
- Browser localStorage

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser, or use the VS Code Live Server extension.
3. Submit a test Lost or Found report.

## Scope and limitations

This is a front-end lab prototype. Data is stored only in the browser that created it. It is not a shared barangay-wide database, and it does not provide user accounts or identity verification. Do not enter sensitive personal information.

## Project files

- `index.html` — page structure and form
- `style.css` — responsive professional styling
- `script.js` — validation, localStorage, search, filtering, and report display
