
A simple caching proxy server built with **Node.js**.  
Inspired from: https://roadmap.sh/projects/caching-server
---

##  Tech Stack

- **Node.js**
- **Commander.js** – command-line parsing
- **Redis**

---
##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/atrociousdinner/proxy_server.git
2. **Navigate to the Expense Tracker directory**
   ```bash
   cd proxy_server
3. **Install dependencies**
   ```bash
   npm install
4. **Make the CLI executable**
   ```bash
   chmod +x index.js
5. **Link it globally to use as a system command:**
   ```bash
   npm link

---
## Usage
```bash
To set up the server: caching-proxy --port [port_number] --origin [origin_site]
To clear the cache: caching-proxy --clear-cache
