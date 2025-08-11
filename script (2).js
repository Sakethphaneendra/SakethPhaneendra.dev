// Initialize Feather Icons
feather.replace();

// Profile Image Cycling
let currentImageIndex = 0;
const profileImages = [
  '', // SP text (no image)
  'profile-img/image1.webp',
  'profile-img/image2.webp',
  'profile-img/image3.webp'
];

function cycleProfileImage() {
  currentImageIndex = (currentImageIndex + 1) % profileImages.length;
  
  const desktopProfile = document.getElementById('desktop-profile');
  const mobileProfile = document.getElementById('mobile-profile');
  
  if (currentImageIndex === 0) {
    // Show SP text
    if (desktopProfile) {
      desktopProfile.style.backgroundImage = '';
      desktopProfile.textContent = 'SP';
      desktopProfile.classList.remove('has-image');
    }
    if (mobileProfile) {
      mobileProfile.style.backgroundImage = '';
      mobileProfile.textContent = 'SP';
      mobileProfile.classList.remove('has-image');
    }
  } else {
    // Show image
    const imageUrl = profileImages[currentImageIndex];
    if (desktopProfile) {
      desktopProfile.style.backgroundImage = `url('${imageUrl}')`;
      desktopProfile.textContent = '';
      desktopProfile.classList.add('has-image');
    }
    if (mobileProfile) {
      mobileProfile.style.backgroundImage = `url('${imageUrl}')`;
      mobileProfile.textContent = '';
      mobileProfile.classList.add('has-image');
    }
  }
}

// Theme Toggle Functionality
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const mobileThemeIcon = document.getElementById('mobile-theme-icon');
  const desktopThemeIcon = document.getElementById('desktop-theme-icon');
  
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    if (themeIcon) themeIcon.setAttribute('data-feather', 'moon');
    if (mobileThemeIcon) mobileThemeIcon.setAttribute('data-feather', 'moon');
    if (desktopThemeIcon) desktopThemeIcon.setAttribute('data-feather', 'moon');
    localStorage.setItem('theme', 'dark');
  } else {
    if (themeIcon) themeIcon.setAttribute('data-feather', 'sun');
    if (mobileThemeIcon) mobileThemeIcon.setAttribute('data-feather', 'sun');
    if (desktopThemeIcon) desktopThemeIcon.setAttribute('data-feather', 'sun');
    localStorage.setItem('theme', 'light');
  }
  
  feather.replace();
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  const themeIcon = document.getElementById('theme-icon');
  const mobileThemeIcon = document.getElementById('mobile-theme-icon');
  const desktopThemeIcon = document.getElementById('desktop-theme-icon');
  
  if (themeIcon) themeIcon.setAttribute('data-feather', 'moon');
  if (mobileThemeIcon) mobileThemeIcon.setAttribute('data-feather', 'moon');
  if (desktopThemeIcon) desktopThemeIcon.setAttribute('data-feather', 'moon');
  feather.replace();
}

// Auto-cycle profile image every 5 seconds
setInterval(cycleProfileImage, 5000);

// Navbar Scroll Behavior
class NavbarScrollManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.lastScrollY = window.scrollY;
    this.isScrolling = false;
    this.ticking = false;
    
    this.init();
  }
  
  init() {
    // Only apply to desktop navbar
    if (!this.navbar || window.innerWidth <= 768) return;
    
    window.addEventListener('scroll', () => {
      this.isScrolling = true;
      this.requestTick();
    });
    
    // Handle resize to reinitialize on desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        // Reset navbar on mobile
        if (this.navbar) {
          this.navbar.style.transform = '';
          this.navbar.style.transition = '';
        }
      }
    });
  }
  
  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => this.updateNavbar());
      this.ticking = true;
    }
  }
  
  updateNavbar() {
    if (!this.navbar || window.innerWidth <= 768) {
      this.ticking = false;
      return;
    }
    
    const currentScrollY = window.scrollY;
    const scrollThreshold = 100; // Start hiding after 100px scroll
    
    // Don't hide navbar when at the top
    if (currentScrollY < scrollThreshold) {
      this.showNavbar();
    } else {
      // Determine scroll direction
      if (currentScrollY > this.lastScrollY) {
        // Scrolling down - hide navbar
        this.hideNavbar();
      } else {
        // Scrolling up - show navbar
        this.showNavbar();
      }
    }
    
    this.lastScrollY = currentScrollY;
    this.ticking = false;
    this.isScrolling = false;
  }
  
  hideNavbar() {
    if (!this.navbar) return;
    
    this.navbar.style.transition = 'transform 0.3s ease-in-out';
    this.navbar.style.transform = 'translateX(-50%) translateY(-130%)';
  }
  
  showNavbar() {
    if (!this.navbar) return;
    
    this.navbar.style.transition = 'transform 0.3s ease-in-out';
    this.navbar.style.transform = 'translateX(-50%) translateY(0)';
  }
}

// Initialize navbar scroll manager
document.addEventListener('DOMContentLoaded', function() {
  const navbarScrollManager = new NavbarScrollManager();
});

// Circular Text Animation
const createAnimation = ({
  duration = 21,
  reversed = false,
  target,
  text,
  textProperties = undefined
}) => {
  const pathId = `path-${Math.floor(Math.random() * 900000) + 100000}`;
  const props = { duration, ease: "none", repeat: -1 };

  gsap.set(target.querySelector("path"), {
    attr: { fill: "none", id: pathId, stroke: "none" }
  });

  target.insertAdjacentHTML(
    "beforeend",
    `
      <text>
        <textPath href='#${pathId}' startOffset="0%">${text}</textPath>
        <textPath href='#${pathId}' startOffset="0%">${text}</textPath>
      </text>
      `
  );

  if (textProperties) {
    gsap.set(target.querySelectorAll("textPath"), textProperties);
  }

  gsap.fromTo(
    target.querySelectorAll("textPath")[0],
    { attr: { startOffset: "0%" } },
    { attr: { startOffset: reversed ? "-100%" : "100%" }, ...props }
  );
  gsap.fromTo(
    target.querySelectorAll("textPath")[1],
    { attr: { startOffset: reversed ? "100%" : "-100%" } },
    { attr: { startOffset: "0%" }, ...props }
  );
};

// Initialize circular text animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const ellipseElement = document.querySelector(".ellipse svg");
  if (ellipseElement) {
    createAnimation({
      duration: 20,
      reversed: true,
      target: ellipseElement,
      text: "★ EXPLORE WORKS ★ EXPLORE WORKS  ",
      textProperties: { 
        fontSize: /iPhone/.test(navigator.userAgent) ? "14px" : "13px",
        letterSpacing: "7px",
        dominantBaseline: "middle",
        textAnchor: "start"
      }
    });
  }
});

// Developer Todo List Animation
const todoTasks = [
  { text: "DSA Problem", icon: "code", priority: "high", completed: false },
  { text: "Apply to Google SWE Role", icon: "briefcase", priority: "high", completed: false },
  { text: "Build AI Chat Agent", icon: "cpu", priority: "medium", completed: false },
  { text: "Deploy Portfolio to AWS", icon: "cloud", priority: "medium", completed: false },
  { text: "Code Review for Team", icon: "users", priority: "low", completed: false },
  { text: "Update LinkedIn Profile", icon: "linkedin", priority: "low", completed: false },
  { text: "Practice System Design", icon: "layers", priority: "high", completed: false },
  { text: "Learn Next.js 14", icon: "book", priority: "medium", completed: false }
];

class TodoListAnimator {
  constructor() {
    this.currentTaskIndex = 0;
    this.displayedTasks = [];
    this.todoContainer = document.getElementById('todo-items');
    this.taskCompletionTimer = null;
  }

  addTodoItem(task, delay = 0) {
    setTimeout(() => {
      if (!this.todoContainer) return;

      const todoItem = document.createElement('div');
      todoItem.classList.add('todo-item');
      todoItem.style.animationDelay = '0s';
      
      todoItem.innerHTML = `
        <i data-feather="${task.icon}" class="todo-icon"></i>
        <span class="todo-text">${task.text}</span>
        <span class="priority ${task.priority}">${task.priority.toUpperCase()}</span>
      `;

      this.todoContainer.appendChild(todoItem);
      this.displayedTasks.push({ element: todoItem, task: task });

      // Re-render feather icons
      feather.replace();

      // Remove old tasks if more than 4 displayed
      if (this.displayedTasks.length > 4) {
        const oldTask = this.displayedTasks.shift();
        oldTask.element.style.animation = 'todoSlideOut 0.4s ease-in forwards';
        setTimeout(() => {
          if (oldTask.element.parentNode) {
            oldTask.element.parentNode.removeChild(oldTask.element);
          }
        }, 400);
      }

      // Schedule task completion
      setTimeout(() => {
        this.completeTask(todoItem);
      }, 4000 + Math.random() * 3000); // Complete after 4-7 seconds

    }, delay);
  }

  completeTask(todoElement) {
    todoElement.classList.add('completed');
    
    // Add strikethrough animation
    const todoText = todoElement.querySelector('.todo-text');
    if (todoText) {
      todoText.style.position = 'relative';
      todoText.style.overflow = 'hidden';
      
      const strikethrough = document.createElement('div');
      strikethrough.style.position = 'absolute';
      strikethrough.style.top = '50%';
      strikethrough.style.left = '0';
      strikethrough.style.width = '100%';
      strikethrough.style.height = '1px';
      strikethrough.style.background = '#00ff88';
      strikethrough.style.transform = 'scaleX(0)';
      strikethrough.style.transformOrigin = 'left';
      strikethrough.style.animation = 'todoStrikethrough 0.6s ease-out forwards';
      
      todoText.appendChild(strikethrough);
    }
  }

  startTodoAnimation() {
    // Add initial tasks with staggered delays
    this.addTodoItem(todoTasks[0], 1000);
    this.addTodoItem(todoTasks[1], 2000);
    this.addTodoItem(todoTasks[2], 3000);

    // Continue adding tasks every 8 seconds
    setInterval(() => {
      this.currentTaskIndex = (this.currentTaskIndex + 1) % todoTasks.length;
      this.addTodoItem(todoTasks[this.currentTaskIndex]);
    }, 8000);
  }
}

// Add CSS for slide out animation
const style = document.createElement('style');
style.textContent = `
  @keyframes todoSlideOut {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Mac Terminal Animation
const macCommands = [
  "npm install",
  "git add .",
  "git commit -m \"Initial commit\"",
  "git push origin main",
  "npm run dev"
];

const macOutputs = {
  "npm install": [
    "added 243 packages, and audited 243 packages in 4s",
    "found 0 vulnerabilities"
  ],
  "git add .": [
    "(no output)"
  ],
  "git commit -m \"Initial commit\"": [
    "[main (root-commit) abc1234] Initial commit",
    " 5 files changed, 120 insertions(+)",
    " create mode 100644 index.html",
    " create mode 100644 style.css",
    " create mode 100644 app.js"
  ],
  "git push origin main": [
    "Enumerating objects: 6, done.",
    "Counting objects: 100% (6/6), done.",
    "Delta compression using up to 12 threads",
    "Compressing objects: 100% (5/5), done.",
    "Writing objects: 100% (6/6), 1.23 KiB | 1.23 MiB/s, done.",
    "Total 6 (delta 0), reused 0 (delta 0), pack-reused 0",
    "To github.com:saketh/portfolio.git",
    " * [new branch]      main -> main"
  ],
  "npm run dev": [
    "> portfolio@1.0.0 dev",
    "> vite",
    "",
    "  VITE v4.2.0  ready in 1404 ms",
    "",
    "  ➜  Local:   http://localhost:5173/",
    "  ➜  Network: use --host to expose",
    "  ➜  press h to show help"
  ]
};

class MacTerminalAnimator {
  constructor() {
    this.currentCommandIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.commandElement = document.getElementById('mac-animated-command');
    this.contentElement = document.getElementById('mac-terminal-content');
  }

  addLine(text, type = 'output') {
    if (!this.contentElement) return;
    
    const newLine = document.createElement('div');
    newLine.classList.add('mac-terminal-line', type);
    newLine.textContent = text;
    this.contentElement.appendChild(newLine);
    
    // Auto-scroll by removing old lines if more than 6 lines (to prevent height growth)
    const lines = this.contentElement.querySelectorAll('.mac-terminal-line');
    if (lines.length > 6) {
      this.contentElement.removeChild(lines[0]);
    }
  }

  addOutput(command) {
    const outputs = macOutputs[command] || [];
    
    // Add the command line first
    this.addLine(command, 'command');
    
    // Add output lines with delay
    outputs.forEach((line, index) => {
      setTimeout(() => {
        this.addLine(line, 'output');
      }, (index + 1) * 100);
    });
  }

  type() {
    if (!this.commandElement) return;
    
    const currentCommand = macCommands[this.currentCommandIndex];
    
    if (!this.isDeleting) {
      this.commandElement.textContent = currentCommand.substring(0, this.currentCharIndex);
      this.currentCharIndex++;
      
      if (this.currentCharIndex > currentCommand.length) {
        this.isDeleting = true;
        
        // Add output when command is complete
        setTimeout(() => {
          this.addOutput(currentCommand);
        }, 500);
        
        setTimeout(() => this.type(), 1500);
        return;
      }
    } else {
      this.commandElement.textContent = currentCommand.substring(0, this.currentCharIndex);
      this.currentCharIndex--;
      
      if (this.currentCharIndex < 0) {
        this.isDeleting = false;
        this.currentCommandIndex = (this.currentCommandIndex + 1) % macCommands.length;
        setTimeout(() => this.type(), 300);
        return;
      }
    }
    
    setTimeout(() => this.type(), this.isDeleting ? 30 : 80);
  }

  start(delay = 0) {
    setTimeout(() => this.type(), delay);
  }
}

// Animated Terminal Commands
const terminalCommands = {
  left: [
    'npm create react-app portfolio',
    'cd portfolio',
    'npm install @mui/material @emotion/react',
    'npm install framer-motion',
    'git init',
    'git add .',
    'git commit -m "Initial commit"',
    'npm run dev',
    'git add .',
    'git commit -m "Added components"',
    'git push origin main',
    'npm run build',
    'npm run deploy'
  ],
  right: [
    'mkdir api-server && cd api-server',
    'npm init -y',
    'npm install express mongoose cors',
    'npm install jsonwebtoken bcryptjs',
    'npm install -D nodemon',
    'git init',
    'git add .',
    'git commit -m "Initial API setup"',
    'npm start',
    'git add .',
    'git commit -m "Added auth routes"',
    'docker build -t api .',
    'docker run -p 5000:5000 api',
    'git push origin main',
    'npm run deploy'
  ],
  center: [
    'kubectl get pods',
    'docker-compose up -d',
    'terraform init',
    'terraform plan',
    'aws s3 sync ./build s3://bucket',
    'helm install myapp ./chart',
    'kubectl apply -f deployment.yaml',
    'docker build -t app:latest .',
    'terraform apply',
    'kubectl logs -f pod/app',
    'aws ecr push app:latest',
    'helm upgrade myapp ./chart'
  ]
};

class TerminalAnimator {
  constructor(side, commands) {
    this.side = side;
    this.commands = commands;
    this.currentCommandIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.element = document.getElementById(`animated-command-${side}`);
    this.contentElement = document.getElementById(`terminal-content-${side}`);
  }

  addContent(text, type = 'info') {
    if (!this.contentElement) return;
    
    const newLine = document.createElement('div');
    newLine.classList.add('terminal-line', type);
    newLine.textContent = text;
    this.contentElement.appendChild(newLine);
    
    // Auto-scroll by removing old lines if more than 6 lines
    const lines = this.contentElement.querySelectorAll('.terminal-line');
    if (lines.length > 6) {
      this.contentElement.removeChild(lines[0]);
    }
  }

  getOutputForCommand(command) {
    if (this.side === 'left') {
      const outputs = {
        'npm create react-app portfolio': '✓ React app created successfully\n📁 Created portfolio directory',
        'cd portfolio': '✓ Changed directory to portfolio',
        'npm install @mui/material @emotion/react': '✓ Material-UI dependencies installed\n📦 Added 47 packages',
        'npm install framer-motion': '✓ Framer Motion animation library added',
        'git init': '✓ Initialized empty Git repository',
        'git add .': '✓ Staged all files for commit',
        'git commit -m "Initial commit"': '✓ [main 1a2b3c4] Initial commit\n📝 15 files changed, 2,847 insertions(+)',
        'npm run dev': '🚀 Development server started\n🌐 Local: http://localhost:3000',
        'git commit -m "Added components"': '✓ [main 5f6g7h8] Added components\n📝 8 files changed, 156 insertions(+)',
        'git push origin main': '✓ Pushed to origin/main\n🌐 Deployed successfully',
        'npm run build': '📦 Production build created\n✨ Build completed in 8.2s',
        'npm run deploy': '🌐 Deployed to production\n✅ Site live at portfolio.dev'
      };
      return outputs[command] || '✓ Command executed';
    } else if (this.side === 'right') {
      const outputs = {
        'mkdir api-server && cd api-server': '✓ Created and entered api-server directory',
        'npm init -y': '✓ Package.json created with defaults',
        'npm install express mongoose cors': '✓ Backend dependencies installed\n📦 Added 23 packages',
        'npm install jsonwebtoken bcryptjs': '✓ Authentication packages added',
        'npm install -D nodemon': '✓ Development dependencies installed',
        'git init': '✓ Initialized Git repository',
        'git add .': '✓ Staged all files',
        'git commit -m "Initial API setup"': '✓ [main 9i0j1k2] Initial API setup\n📝 12 files changed, 1,234 insertions(+)',
        'npm start': '🚀 Server running on port 5000\n🔗 Connected to MongoDB',
        'git commit -m "Added auth routes"': '✓ [main 3l4m5n6] Added auth routes\n📝 6 files changed, 89 insertions(+)',
        'docker build -t api .': '🐳 Docker image built successfully\n📦 Image size: 245MB',
        'docker run -p 5000:5000 api': '📡 Container running on port 5000',
        'git push origin main': '✓ Pushed to origin/main\n☁️ CI/CD pipeline triggered',
        'npm run deploy': '☁️ API deployed to cloud\n✅ Live at api.portfolio.dev'
      };
      return outputs[command] || '✓ Command executed';
    } else if (this.side === 'center') {
      const outputs = {
        'kubectl get pods': '✓ NAME READY STATUS RESTARTS AGE\n📋 app-7d8f9g1h2 1/1 Running 0 2m',
        'docker-compose up -d': '🐳 Creating network app_default\n✅ Container app_db_1 Started',
        'terraform init': '⚡ Terraform initialized successfully\n📦 Provider plugins installed',
        'terraform plan': '📋 Plan: 5 to add, 0 to change, 0 to destroy\n✓ Infrastructure plan ready',
        'aws s3 sync ./build s3://bucket': '☁️ Uploading build files to S3\n✅ 23 files synced successfully',
        'helm install myapp ./chart': '⎈ Release myapp installed\n🚀 Chart deployed to cluster',
        'kubectl apply -f deployment.yaml': '✓ deployment.apps/myapp created\n📦 Service myapp-service created',
        'docker build -t app:latest .': '🐳 Building Docker image\n✅ Image app:latest built successfully',
        'terraform apply': '⚡ Applying infrastructure changes\n✅ Apply complete! Resources: 5 added',
        'kubectl logs -f pod/app': '📄 Streaming logs from pod\n🔍 App started on port 3000',
        'aws ecr push app:latest': '☁️ Pushing to ECR repository\n✅ Image pushed to registry',
        'helm upgrade myapp ./chart': '⎈ Upgrading release myapp\n✅ Release upgraded successfully'
      };
      return outputs[command] || '✓ Command executed';
    }
  }

  type() {
    if (!this.element) return;
    
    const currentCommand = this.commands[this.currentCommandIndex];
    
    if (!this.isDeleting) {
      this.element.textContent = currentCommand.substring(0, this.currentCharIndex);
      this.currentCharIndex++;
      
      if (this.currentCharIndex > currentCommand.length) {
        this.isDeleting = true;
        
        // Add output when command is complete
        const output = this.getOutputForCommand(currentCommand);
        const outputLines = output.split('\n');
        
        // Add each line with a slight delay for realistic effect
        outputLines.forEach((line, index) => {
          setTimeout(() => {
            this.addContent(line, 'success');
          }, index * 200);
        });
        
        setTimeout(() => this.type(), 800);
        return;
      }
    } else {
      this.element.textContent = currentCommand.substring(0, this.currentCharIndex);
      this.currentCharIndex--;
      
      if (this.currentCharIndex < 0) {
        this.isDeleting = false;
        this.currentCommandIndex = (this.currentCommandIndex + 1) % this.commands.length;
        setTimeout(() => this.type(), 200);
        return;
      }
    }
    
    setTimeout(() => this.type(), this.isDeleting ? 20 : 60);
  }

  start(delay = 0) {
    setTimeout(() => this.type(), delay);
  }
}

// Start terminal animations
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Mac terminal animation
  const macTerminal = new MacTerminalAnimator();
  macTerminal.start(500);
  
  // Initialize todo list animation
  const todoList = new TodoListAnimator();
  todoList.startTodoAnimation();
  
  // Initialize left and right terminals only
  const leftTerminal = new TerminalAnimator('left', terminalCommands.left);
  const rightTerminal = new TerminalAnimator('right', terminalCommands.right);

  leftTerminal.start(1000);
  rightTerminal.start(2000);
});

// Project Preview Cards Functionality
class ProjectPreviewManager {
  constructor() {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.currentPreview = null;
    this.mousePosition = { x: 0, y: 0 };
    this.targetPosition = { x: 0, y: 0 };
    this.animationId = null;
    
    this.init();
  }
  
  init() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
      const preview = item.querySelector('.project-preview');
      
      if (this.isTouch) {
        // Mobile touch events
        item.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.showPreview(preview);
        });
        
        item.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.hidePreview(preview);
        });
      } else {
        // Desktop mouse events
        item.addEventListener('mouseenter', () => {
          this.showPreview(preview);
          this.startFollowMouse(preview);
        });
        
        item.addEventListener('mouseleave', () => {
          this.hidePreview(preview);
          this.stopFollowMouse();
        });
        
        item.addEventListener('mousemove', (e) => {
          this.updateMousePosition(e);
        });
      }
    });
  }
  
  showPreview(preview) {
    if (this.currentPreview && this.currentPreview !== preview) {
      this.hidePreview(this.currentPreview);
    }
    
    this.currentPreview = preview;
    
    // Add a small delay for better UX
    setTimeout(() => {
      preview.classList.add('show');
    }, 100);
  }
  
  hidePreview(preview) {
    preview.classList.remove('show');
    
    if (this.currentPreview === preview) {
      this.currentPreview = null;
    }
  }
  
  updateMousePosition(e) {
    this.targetPosition.x = e.clientX;
    this.targetPosition.y = e.clientY;
  }
  
  startFollowMouse(preview) {
    if (this.isTouch) return;
    
    const animate = () => {
      if (!this.currentPreview || this.currentPreview !== preview) {
        return;
      }
      
      // Smooth mouse following with slight delay
      const ease = 0.12;
      this.mousePosition.x += (this.targetPosition.x - this.mousePosition.x) * ease;
      this.mousePosition.y += (this.targetPosition.y - this.mousePosition.y) * ease;
      
      // Position the preview card with offset to avoid cursor overlap
      const offsetX = 25;
      const offsetY = -125;
      
      // Keep card within viewport bounds
      const cardWidth = 350;
      const cardHeight = 250;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let x = this.mousePosition.x + offsetX;
      let y = this.mousePosition.y + offsetY;
      
      // Adjust if card would go off-screen
      if (x + cardWidth > viewportWidth - 20) {
        x = this.mousePosition.x - cardWidth - offsetX;
      }
      if (x < 20) {
        x = 20;
      }
      if (y < 20) {
        y = this.mousePosition.y + offsetY + 150;
      }
      if (y + cardHeight > viewportHeight - 20) {
        y = viewportHeight - cardHeight - 20;
      }
      
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }
  
  stopFollowMouse() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize project preview functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add a delay to ensure all other elements are properly loaded
  setTimeout(() => {
    const previewManager = new ProjectPreviewManager();
  }, 1000);
});

// Parallax Scrolling Effect for Hero Section
class ParallaxManager {
  constructor() {
    this.heroSection = document.querySelector('.hero-section');
    this.terminals = {
      left: document.querySelector('.terminal-left'),
      right: document.querySelector('.terminal-right'),
      mac: document.querySelector('.mac-terminal')
    };
    this.floatingIcons = document.querySelectorAll('.tech-icon');
    this.heroContent = document.querySelector('.hero-content');
    this.todoList = document.querySelector('.dev-todo-list');
    this.mobileTerminals = {
      terminal1: document.querySelector('.mobile-terminal-1'),
      terminal2: document.querySelector('.mobile-terminal-2')
    };
    
    this.isScrolling = false;
    this.ticking = false;
    
    this.init();
  }
  
  init() {
    // Check if we're on mobile or desktop
    this.isMobile = window.innerWidth <= 768;
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
      this.isScrolling = true;
      this.requestTick();
    });
    
    // Handle resize events
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
    
    // Set initial positions
    this.updateElements();
  }
  
  requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => this.updateElements());
      this.ticking = true;
    }
  }
  
  updateElements() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = this.heroSection ? this.heroSection.offsetHeight : 0;
    
    // Only apply parallax when hero section is visible
    if (scrollTop < heroHeight) {
      // Different speeds for different elements
      const terminalSpeed = 0.8; // Fastest
      const iconSpeed = 0.5;     // Medium
      const contentSpeed = 0.3;  // Slowest
      const todoSpeed = 0.6;     // Medium-fast
      
      // Calculate transform values
      const terminalTransform = scrollTop * terminalSpeed;
      const iconTransform = scrollTop * iconSpeed;
      const contentTransform = scrollTop * contentSpeed;
      const todoTransform = scrollTop * todoSpeed;
      
      if (!this.isMobile) {
        // Desktop parallax effects
        
        // Terminals move fastest upward
        if (this.terminals.left) {
          this.terminals.left.style.transform = `translateY(${terminalTransform}px)`;
        }
        if (this.terminals.right) {
          this.terminals.right.style.transform = `translateY(${terminalTransform}px)`;
        }
        if (this.terminals.mac) {
          this.terminals.mac.style.transform = `translateY(${terminalTransform}px)`;
        }
        
        // Todo list moves fast
        if (this.todoList) {
          this.todoList.style.transform = `translateY(${todoTransform}px)`;
        }
        
        // Floating icons move at medium speed
        this.floatingIcons.forEach((icon, index) => {
          // Add slight variation to each icon for more natural movement
          const variation = (index % 3) * 0.1;
          const iconTransformWithVariation = iconTransform + (scrollTop * variation);
          icon.style.transform = `translateY(${iconTransformWithVariation}px)`;
        });
        
        // Hero content moves upward (negative transform for upward movement)
        if (this.heroContent) {
          this.heroContent.style.transform = `translateY(-${contentTransform}px)`;
        }
      } else {
        // Mobile parallax effects (more subtle)
        const mobileTerminalSpeed = 0.4;
        const mobileIconSpeed = 0.25;
        const mobileContentSpeed = 0.15;
        
        const mobileTerminalTransform = scrollTop * mobileTerminalSpeed;
        const mobileIconTransform = scrollTop * mobileIconSpeed;
        const mobileContentTransform = scrollTop * mobileContentSpeed;
        
        // Mobile terminals
        if (this.mobileTerminals.terminal1) {
          this.mobileTerminals.terminal1.style.transform = `translateY(${mobileTerminalTransform}px)`;
        }
        if (this.mobileTerminals.terminal2) {
          this.mobileTerminals.terminal2.style.transform = `translateY(${mobileTerminalTransform}px)`;
        }
        
        // Floating icons (fewer on mobile, but still apply effect)
        this.floatingIcons.forEach((icon, index) => {
          const variation = (index % 2) * 0.05;
          const iconTransformWithVariation = mobileIconTransform + (scrollTop * variation);
          icon.style.transform = `translateY(${iconTransformWithVariation}px)`;
        });
        
        // Hero content moves upward on mobile
        if (this.heroContent) {
          this.heroContent.style.transform = `translateY(-${mobileContentTransform}px)`;
        }
        
        // Todo list on mobile
        if (this.todoList) {
          this.todoList.style.transform = `translateY(${mobileTerminalTransform * 0.7}px)`;
        }
      }
    } else {
      // Reset transforms when hero section is out of view
      this.resetTransforms();
    }
    
    this.ticking = false;
    this.isScrolling = false;
  }
  
  resetTransforms() {
    // Reset all transforms when scrolled past hero section
    if (this.terminals.left) this.terminals.left.style.transform = '';
    if (this.terminals.right) this.terminals.right.style.transform = '';
    if (this.terminals.mac) this.terminals.mac.style.transform = '';
    if (this.todoList) this.todoList.style.transform = '';
    if (this.heroContent) this.heroContent.style.transform = '';
    
    this.floatingIcons.forEach(icon => {
      icon.style.transform = '';
    });
    
    if (this.mobileTerminals.terminal1) this.mobileTerminals.terminal1.style.transform = '';
    if (this.mobileTerminals.terminal2) this.mobileTerminals.terminal2.style.transform = '';
  }
}

// Initialize parallax effect
document.addEventListener('DOMContentLoaded', function() {
  // Initialize parallax manager after a short delay
  setTimeout(() => {
    const parallaxManager = new ParallaxManager();
  }, 500);
});

// Dark Portfolio Floating Preview Manager
class DarkPortfolioManager {
  constructor() {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.currentPreview = null;
    this.currentProjectItem = null;
    this.projectsSection = document.querySelector('.dark-portfolio-section');
    this.mousePosition = { x: 0, y: 0 };
    this.targetPosition = { x: 0, y: 0 };
    this.animationId = null;
    this.isMouseInProject = false;
    this.hideTimeout = null;
    this.init();
  }
  
  init() {
    // Only initialize on desktop (non-touch devices)
    if (this.isTouch) return;
    
    const projectItems = document.querySelectorAll('.dark-portfolio-section .project-item');
    
    // Store all project items for global management
    this.projectItems = projectItems;
    
    projectItems.forEach((item, index) => {
      const preview = item.querySelector('.floating-preview');
      
      if (!preview) return;
      
      // Add project link data attribute for future use
      item.setAttribute('data-project-link', `#project-${index + 1}`);
      
      // Mouse enter project
      item.addEventListener('mouseenter', (e) => {
        // Immediately hide all other previews for instant switching
        this.hideAllPreviews();
        
        this.isMouseInProject = true;
        this.currentProjectItem = item;
        this.updateTargetPosition(e);
        this.showPreview(preview, item);
        this.startFollowMouse(preview);
      });
      
      // Mouse leave project
      item.addEventListener('mouseleave', (e) => {
        this.isMouseInProject = false;
        this.currentProjectItem = null;
        // Immediately hide preview when leaving project area
        this.hidePreview(preview, true);
        this.stopFollowMouse();
      });
      
      // Mouse move within project
      item.addEventListener('mousemove', (e) => {
        if (this.isMouseInProject) {
          this.updateTargetPosition(e);
        }
      });
      
      // Preview hover events - no longer needed since we hide immediately
      // The preview will be hidden instantly when leaving project area
      
      // Allow default link behavior for floating preview
      // The preview is already wrapped in an <a> tag, so no custom click handling needed
      
      // Preview no longer needs click handlers since it uses pointer-events: none
      // Clicks will naturally pass through to underlying elements
    });
  }
  
  updateTargetPosition(e) {
    this.targetPosition.x = e.clientX;
    this.targetPosition.y = e.clientY;
    
    // Initialize mouse position for smooth start
    if (this.mousePosition.x === 0 && this.mousePosition.y === 0) {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    }
  }
  
  showPreview(preview, projectItem) {
    // Hide any currently visible preview instantly
    if (this.currentPreview && this.currentPreview !== preview) {
      this.hidePreview(this.currentPreview, true);
    }
    
    this.currentPreview = preview;
    
    // Show preview immediately for instant response
    preview.classList.add('show');
  }
  
  scheduleHidePreview(preview) {
    this.hideTimeout = setTimeout(() => {
      this.hidePreview(preview);
    }, 300); // Increased delay to allow clicking
  }
  
  clearHideTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
  
  hideAllPreviews() {
    // Hide all previews instantly
    if (this.projectItems) {
      this.projectItems.forEach(item => {
        const preview = item.querySelector('.floating-preview');
        if (preview) {
          preview.classList.remove('show');
        }
      });
    }
    this.currentPreview = null;
    this.clearHideTimeout();
  }

  hidePreview(preview, instant = false) {
    this.clearHideTimeout();
    
    if (instant) {
      preview.classList.remove('show');
    } else {
      preview.classList.remove('show');
    }
    
    if (this.currentPreview === preview) {
      this.currentPreview = null;
    }
  }
  
  startFollowMouse(preview) {
    const animate = () => {
      if (!this.currentPreview || this.currentPreview !== preview) {
        return;
      }
      
      // Smooth following with moderate lag
      const ease = 0.08;
      this.mousePosition.x += (this.targetPosition.x - this.mousePosition.x) * ease;
      this.mousePosition.y += (this.targetPosition.y - this.mousePosition.y) * ease;
      
      // Center the preview near the cursor
      const previewWidth = 320;
      const previewHeight = 200;
      
      // Position slightly offset from cursor
      let x = this.mousePosition.x - (previewWidth / 2) + 20;
      let y = this.mousePosition.y - previewHeight - 20;
      
      // Keep preview within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 20;
      
      // Horizontal bounds
      if (x + previewWidth > viewportWidth - margin) {
        x = viewportWidth - previewWidth - margin;
      }
      if (x < margin) {
        x = margin;
      }
      
      // Vertical bounds
      if (y < margin) {
        y = this.mousePosition.y + 20; // Show below cursor if no space above
      }
      if (y + previewHeight > viewportHeight - margin) {
        y = viewportHeight - previewHeight - margin;
      }
      
      // Apply position
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }
  
  stopFollowMouse() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize Dark Portfolio functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize after a delay to ensure all elements are loaded
  setTimeout(() => {
    const darkPortfolioManager = new DarkPortfolioManager();
  }, 1200);
});

// Skills Section Animation Manager
class SkillsAnimationManager {
  constructor() {
    this.skillCards = document.querySelectorAll('.skill-card');
    this.observer = null;
    this.init();
  }
  
  init() {
    this.createIntersectionObserver();
    this.addHoverEffects();
  }
  
  createIntersectionObserver() {
    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.skill-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, index * 150);
          });
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      this.observer.observe(skillsSection);
    }
  }
  
  addHoverEffects() {
    this.skillCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateSkillTags(card);
      });
    });
  }
  
  animateSkillTags(card) {
    const tags = card.querySelectorAll('.skill-tag');
    tags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'translateY(-2px) scale(1.05)';
        tag.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.3)';
        setTimeout(() => {
          tag.style.transform = '';
          tag.style.boxShadow = '';
        }, 200);
      }, index * 50);
    });
  }
}

// Experience Timeline Animation Manager
class ExperienceAnimationManager {
  constructor() {
    this.timelineItems = document.querySelectorAll('.timeline-item');
    this.timelineLine = document.querySelector('.timeline-line');
    this.observer = null;
    this.init();
  }
  
  init() {
    this.createIntersectionObserver();
    this.animateTimelineLine();
    this.addCardHoverEffects();
  }
  
  createIntersectionObserver() {
    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const timelineItems = entry.target.querySelectorAll('.timeline-item');
          timelineItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('animate-in');
              this.animateTimelineDot(item);
            }, index * 200);
          });
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const experienceSection = document.querySelector('.experience-section');
    if (experienceSection) {
      this.observer.observe(experienceSection);
    }
  }
  
  animateTimelineLine() {
    if (this.timelineLine) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.timelineLine.style.animation = 'timelineGrow 2s ease-out forwards';
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(this.timelineLine);
    }
  }
  
  animateTimelineDot(timelineItem) {
    const dot = timelineItem.querySelector('.timeline-dot');
    if (dot) {
      dot.style.animation = 'dotPulse 0.6s ease-out';
    }
  }
  
  addCardHoverEffects() {
    this.timelineItems.forEach(item => {
      const card = item.querySelector('.timeline-card');
      if (card) {
        card.addEventListener('mouseenter', () => {
          this.animateTechTags(card);
        });
      }
    });
  }
  
  animateTechTags(card) {
    const techTags = card.querySelectorAll('.tech-tag');
    techTags.forEach((tag, index) => {
      setTimeout(() => {
        tag.style.transform = 'scale(1.1)';
        tag.style.background = 'rgba(99, 102, 241, 0.4)';
        setTimeout(() => {
          tag.style.transform = '';
          tag.style.background = '';
        }, 300);
      }, index * 100);
    });
  }
}

// Contact Form Manager
class ContactFormManager {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.submitBtn = document.querySelector('.submit-btn');
    this.socialIcons = document.querySelectorAll('.social-icon');
    this.formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.addFormValidation();
      this.addSubmitHandler();
      this.addInputAnimations();
    }
    this.addSocialIconAnimations();
  }
  
  addFormValidation() {
    this.formInputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateInput(input);
      });
      
      input.addEventListener('focus', () => {
        this.clearInputError(input);
      });
    });
  }
  
  validateInput(input) {
    const formGroup = input.closest('.form-group');
    const isValid = input.checkValidity();
    
    if (!isValid) {
      formGroup.classList.add('error');
      input.style.borderColor = '#ef4444';
      input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    } else {
      formGroup.classList.remove('error');
      input.style.borderColor = '#10b981';
      input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    }
  }
  
  clearInputError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }
  
  addSubmitHandler() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }
  
  handleFormSubmit() {
    // Create ripple effect
    this.createRippleEffect();
    
    // Simulate form submission
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<span class="btn-text">Sending...</span><div class="spinner"></div>';
    
    setTimeout(() => {
      this.submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span><i data-feather="check"></i>';
      this.submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      
      // Re-initialize feather icons for the new check icon
      if (window.feather) {
        feather.replace();
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.resetForm();
      }, 3000);
    }, 2000);
  }
  
  createRippleEffect() {
    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    
    const rect = this.submitBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';
    
    this.submitBtn.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  resetForm() {
    this.form.reset();
    this.submitBtn.disabled = false;
    this.submitBtn.innerHTML = '<span class="btn-text">Send Message</span><div class="btn-icon"><i data-feather="send"></i></div>';
    this.submitBtn.style.background = '';
    
    // Clear all input styles
    this.formInputs.forEach(input => {
      this.clearInputError(input);
    });
    
    // Re-initialize feather icons
    if (window.feather) {
      feather.replace();
    }
  }
  
  addInputAnimations() {
    this.formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.02)';
        input.style.transition = 'all 0.3s ease';
      });
      
      input.addEventListener('blur', () => {
        input.style.transform = '';
      });
    });
  }
  
  addSocialIconAnimations() {
    this.socialIcons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        this.animateSocialIcon(icon);
      });
    });
  }
  
  animateSocialIcon(icon) {
    const iconSvg = icon.querySelector('svg');
    if (iconSvg) {
      iconSvg.style.animation = 'bounce 0.6s ease';
      setTimeout(() => {
        iconSvg.style.animation = '';
      }, 600);
    }
  }
}

// Scroll Animation Manager for All Sections
class ScrollAnimationManager {
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.observer = null;
    this.init();
  }
  
  init() {
    this.createSectionObserver();
    this.addScrollToTopFunctionality();
    this.initializeContactAnimations();
  }
  
  createSectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          this.animateSectionElements(entry.target);
        }
      });
    }, options);
    
    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }
  
  animateSectionElements(section) {
    const title = section.querySelector('.section-title');
    if (title) {
      title.style.animation = 'titleSlideUp 0.8s ease-out forwards';
    }
  }
  
  initializeContactAnimations() {
    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Animate contact form
            const form = entry.target.querySelector('.contact-form');
            if (form) {
              setTimeout(() => {
                form.style.animation = 'formSlideIn 0.8s ease-out forwards';
              }, 200);
            }
            
            // Animate contact info
            const info = entry.target.querySelector('.contact-info');
            if (info) {
              setTimeout(() => {
                info.style.animation = 'contactInfoSlide 0.8s ease-out forwards';
              }, 400);
            }
          }
        });
      }, { threshold: 0.2 });
      
      observer.observe(contactSection);
    }
  }
  
  addScrollToTopFunctionality() {
    // Add smooth scrolling to navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"], .footer-column a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Initialize all new section managers
document.addEventListener('DOMContentLoaded', function() {
  // Initialize new section managers after a delay
  setTimeout(() => {
    new SkillsAnimationManager();
    new ExperienceAnimationManager();
    new ContactFormManager();
    new ScrollAnimationManager();
  }, 1500);
  
  // Add custom CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes drawLine {
      from {
        height: 0;
      }
      to {
        height: 100%;
      }
    }
    
    @keyframes dotPulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
      }
      70% {
        transform: scale(1.1);
        box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
      }
    }
    
    @keyframes bounce {
      0%, 20%, 60%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      80% {
        transform: translateY(-5px);
      }
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .animate-in {
      animation: fadeInUp 0.8s ease-out forwards;
    }
    
    .section-visible {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
});