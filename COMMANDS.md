# BiteBridge Quick Commands

Here are the terminal commands you need to manage the BiteBridge server. Open your terminal, ensure you are in the `bitbridge` folder (`cd ~/Desktop/DBMS-Project/bitbridge`), and run these:

### 0. Initial Setup (Run this only the very first time)
Before you can run the server for the first time, you need to install dependencies and set up the database:
```bash
cd ~/Desktop/DBMS-Project/bitbridge && ./setup.sh
```

### 1. Start the Server (Frontend + Backend)
Run this to start the site. It will keep running in that terminal window.
```bash
cd ~/Desktop/DBMS-Project/bitbridge && ./start.sh
```
*(The site will be available at http://localhost:5173)*

### 2. Stop the Server
If you ran `./start.sh` in a terminal, just go to that terminal and press:
```text
Ctrl + C
```
*If for some reason it's still running in the background and you want to force close it:*
```bash
kill $(lsof -t -i:5001) 2>/dev/null; kill $(lsof -t -i:5173) 2>/dev/null
```

### 3. Restart the Server
To restart the server completely, first stop it (Ctrl+C), then start it again:
```bash
cd ~/Desktop/DBMS-Project/bitbridge && ./start.sh
```

### 4. Rebuild / Re-setup Everything
If you make major changes to the database or install new packages and need to completely rebuild and restart everything from scratch:
```bash
cd ~/Desktop/DBMS-Project/bitbridge && ./setup.sh
```

### 5. Start Backend and Frontend Separately
If you want to run them in two different terminal windows (easier for seeing errors):

**Terminal 1 (Backend):**
```bash
cd ~/Desktop/DBMS-Project/bitbridge/backend && source venv/bin/activate && flask run --port=5001
```

**Terminal 2 (Frontend):**
```bash
cd ~/Desktop/DBMS-Project/bitbridge/frontend && npm run dev
```
