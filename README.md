# WhichTest

<div align="center">
  <img src="public/whichtest_logo.svg" alt="WhichTestLogo" width="400"/>
</div>

<br>


---

## Run locally

This project is a static HTML app. It should be served from the repository root with any local HTTP server.

Example:

```bash
cd /mnt/data/projects/whichtest
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

The app loads its data feed from `public/feed.yaml`. It also falls back to `feed.yaml` at the site root, which helps if the project is later served by a tool that exposes `public/` assets at `/`.


## 🏢 About

Developed with ❤️ by **Happy Raven Labs**

---
