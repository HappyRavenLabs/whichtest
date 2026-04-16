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

## 🚀 Deployment

### GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions. Every push to the `main` branch will trigger a deployment.

**Setup Instructions:**

1. **Enable GitHub Pages**: Go to your repository settings → Pages → Source → Select "GitHub Actions"
2. **Push to main**: The workflow will automatically run and deploy your site
3. **Access your site**: Visit `https://<username>.github.io/<repository-name>`

### Custom Domain

To use your own domain:

1. **Update CNAME file**: Edit the `CNAME` file in the repository root and replace `your-domain.com` with your actual domain
2. **Configure DNS**: In your domain registrar, set up DNS records:
   - For apex domain (example.com): Create an A record pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For subdomain (www.example.com): Create a CNAME record pointing to `<username>.github.io`
3. **Enable HTTPS**: GitHub Pages will automatically provision SSL certificates for custom domains

**Example DNS Configuration:**
```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
CNAME   www     yourusername.github.io
```

### Manual Deployment

You can also deploy manually to any static hosting provider:

```bash
# Build is not required - this is a static HTML app
# Simply upload all files to your web server root directory
rsync -av --exclude='.git' ./ user@yourserver.com:/var/www/html/
```

## 🏢 About

Developed with ❤️ by **Happy Raven Labs**

---