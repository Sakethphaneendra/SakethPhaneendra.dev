// Performance optimized initialization
// Initialize Feather Icons with defer to avoid blocking
document.addEventListener('DOMContentLoaded', () => {
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});

// Optimized debounce function for better INP
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Optimized Profile Image Cycling with better performance
let currentImageIndex = 0;
const profileImages = [
  '', // SP text (no image)
  'profile-img/image1.webp',
  'profile-img/image2.webp',
  'profile-img/image3.webp'
];

// Preload images for better performance
const preloadImages = () => {
  profileImages.forEach(src => {
    if (src) {
      const img = new Image();
      img.src = src;
    }
  });
};

// Debounced version to prevent rapid clicking issues (INP optimization)
const cycleProfileImage = debounce(() => {
  currentImageIndex = (currentImageIndex + 1) % profileImages.length;
  
  const desktopProfile = document.getElementById('desktop-profile');
  const mobileProfile = document.getElementById('mobile-profile');
  
  // Use requestAnimationFrame for smooth DOM updates
  requestAnimationFrame(() => {
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
  });
}, 150, true); // 150ms debounce, immediate first call

// Optimized Theme Toggle with performance improvements
const toggleTheme = debounce(() => {
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  const mobileThemeIcon = document.getElementById('mobile-theme-icon');
  const desktopThemeIcon = document.getElementById('desktop-theme-icon');
  
  // Use requestAnimationFrame for smooth transitions
  requestAnimationFrame(() => {
    body.classList.toggle('dark-mode');
    
    const isDark = body.classList.contains('dark-mode');
    const iconName = isDark ? 'moon' : 'sun';
    
    [themeIcon, mobileThemeIcon, desktopThemeIcon].forEach(icon => {
      if (icon) icon.setAttribute('data-feather', iconName);
    });
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Defer feather icon replacement to avoid blocking
    setTimeout(() => {
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    }, 0);
  });
}, 100, true); // 100ms debounce with immediate first call

// Optimized theme loading
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    
    // Batch DOM updates
    requestAnimationFrame(() => {
      const icons = [
        document.getElementById('theme-icon'),
        document.getElementById('mobile-theme-icon'),
        document.getElementById('desktop-theme-icon')
      ];
      
      icons.forEach(icon => {
        if (icon) icon.setAttribute('data-feather', 'moon');
      });
      
      // Defer feather replacement
      setTimeout(() => {
        if (typeof feather !== 'undefined') {
          feather.replace();
        }
      }, 0);
    });
  }
  
  // Preload profile images
  preloadImages();
  
  // Auto-cycle profile image with longer interval to reduce resource usage
  setInterval(cycleProfileImage, 7000); // Increased from 5000ms to 7000ms
});

// Optimized Navbar Scroll Manager with better performance
class NavbarScrollManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.lastScrollY = window.scrollY;
    this.isScrolling = false;
    this.ticking = false;
    this.rafId = null;
    
    this.init();
  }
  
  init() {
    // Only apply to desktop navbar
    if (!this.navbar || window.innerWidth <= 768) return;
    
    // Initialize navbar in visible state
    this.navbar.classList.add('navbar--visible');
    
    // Use throttled scroll handler for better INP
    const throttledScroll = throttle(() => {
      this.isScrolling = true;
      this.requestTick();
    }, 16); // ~60fps throttle
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Optimized resize handler
    const debouncedResize = debounce(() => {
      if (window.innerWidth <= 768) {
        // Reset navbar on mobile
        if (this.navbar) {
          this.navbar.style.transform = '';
          this.navbar.style.transition = '';
          this.navbar.classList.remove('navbar--hidden', 'navbar--visible');
        }
      }
    }, 250);
    
    window.addEventListener('resize', debouncedResize, { passive: true });
  }
  
  requestTick() {
    if (!this.ticking) {
      this.rafId = requestAnimationFrame(() => this.updateNavbar());
      this.ticking = true;
    }
  }
  
  updateNavbar() {
    if (!this.navbar || window.innerWidth <= 768) {
      this.ticking = false;
      return;
    }
    
    const currentScrollY = window.scrollY;
    const scrollThreshold = 100;
    
    // Don't hide navbar when at the top
    if (currentScrollY < scrollThreshold) {
      this.showNavbar();
    } else {
      // Determine scroll direction
      if (currentScrollY > this.lastScrollY) {
        this.hideNavbar();
      } else {
        this.showNavbar();
      }
    }
    
    this.lastScrollY = currentScrollY;
    this.ticking = false;
    this.isScrolling = false;
  }
  
  hideNavbar() {
    if (!this.navbar) return;
    
    // Use CSS classes for better performance and reliability
    this.navbar.classList.remove('navbar--visible');
    this.navbar.classList.add('navbar--hidden');
  }
  
  showNavbar() {
    if (!this.navbar) return;
    
    this.navbar.classList.remove('navbar--hidden');
    this.navbar.classList.add('navbar--visible');
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

// Optimized initialization with priority scheduling
document.addEventListener('DOMContentLoaded', function() {
  // High priority: Initialize navbar first (affects LCP)
  requestAnimationFrame(() => {
    const navbarScrollManager = new NavbarScrollManager();
    
    // Medium priority: Initialize in next frame
    requestAnimationFrame(() => {
      // Initialize circular text animation with intersection observer
      const ellipseElement = document.querySelector(".ellipse svg");
      if (ellipseElement) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
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
              observer.disconnect(); // Run only once
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(ellipseElement);
      }
      
      // Low priority: Initialize heavy animations after user interaction or idle
      const initHeavyAnimations = () => {
        // Text on Tread Animation
        initTextOnTread();
        
        // Animated Grid
        initAnimatedGrid();
        
        // Terminal animations with delay
        setTimeout(() => {
          const macTerminal = new MacTerminalAnimator();
          macTerminal.start(500);
          
          const todoList = new TodoListAnimator();
          todoList.startTodoAnimation();
          
          const leftTerminal = new TerminalAnimator('left', terminalCommands.left);
          const rightTerminal = new TerminalAnimator('right', terminalCommands.right);

          leftTerminal.start(1000);
          rightTerminal.start(2000);
        }, 1000);
        
        // Project preview and parallax managers
        setTimeout(() => {
          const previewManager = new ProjectPreviewManager();
          const darkPortfolioManager = new DarkPortfolioManager();
          const parallaxManager = new ParallaxManager();
        }, 2000);
      };
      
      // Use requestIdleCallback if available, otherwise setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initHeavyAnimations, { timeout: 3000 });
      } else {
        setTimeout(initHeavyAnimations, 2000);
      }
    });
  });
});

// Optimized GSAP animation with lazy loading
const createAnimation = ({
  duration = 21,
  reversed = false,
  target,
  text,
  textProperties = undefined
}) => {
  // Only create animation if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping animation');
    return;
  }
  
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



// Optimized Parallax Scrolling Effect for Hero Section
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
    this.rafId = null;
    
    this.init();
  }
  
  init() {
    // Check if we're on mobile or desktop
    this.isMobile = window.innerWidth <= 768;
    
    // Use throttled scroll event listener for better performance
    const throttledScroll = throttle(() => {
      this.isScrolling = true;
      this.requestTick();
    }, 16); // ~60fps
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Optimized resize handler
    const debouncedResize = debounce(() => {
      this.isMobile = window.innerWidth <= 768;
    }, 250);
    
    window.addEventListener('resize', debouncedResize, { passive: true });
    
    // Set initial positions
    this.updateElements();
  }
  
  requestTick() {
    if (!this.ticking) {
      this.rafId = requestAnimationFrame(() => this.updateElements());
      this.ticking = true;
    }
  }
  
  updateElements() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = this.heroSection ? this.heroSection.offsetHeight : 0;
    
    // Only apply parallax when hero section is visible
    if (scrollTop < heroHeight) {
      // Use transform3d for hardware acceleration
      const terminalSpeed = 0.8;
      const iconSpeed = 0.5;
      const contentSpeed = 0.3;
      const todoSpeed = 0.6;
      
      const terminalTransform = scrollTop * terminalSpeed;
      const iconTransform = scrollTop * iconSpeed;
      const contentTransform = scrollTop * contentSpeed;
      const todoTransform = scrollTop * todoSpeed;
      
      if (!this.isMobile) {
        // Desktop parallax effects with transform3d
        if (this.terminals.left) {
          this.terminals.left.style.transform = `translate3d(0, ${terminalTransform}px, 0)`;
        }
        if (this.terminals.right) {
          this.terminals.right.style.transform = `translate3d(0, ${terminalTransform}px, 0)`;
        }
        if (this.terminals.mac) {
          this.terminals.mac.style.transform = `translate3d(0, ${terminalTransform}px, 0)`;
        }
        
        if (this.todoList) {
          this.todoList.style.transform = `translate3d(0, ${todoTransform}px, 0)`;
        }
        
        // Use transform3d for better performance
        this.floatingIcons.forEach((icon, index) => {
          const variation = (index % 3) * 0.1;
          const iconTransformWithVariation = iconTransform + (scrollTop * variation);
          icon.style.transform = `translate3d(0, ${iconTransformWithVariation}px, 0)`;
        });
        
        if (this.heroContent) {
          this.heroContent.style.transform = `translate3d(0, -${contentTransform}px, 0)`;
        }
      } else {
        // Mobile parallax effects (more subtle)
        const mobileTerminalSpeed = 0.4;
        const mobileIconSpeed = 0.25;
        const mobileContentSpeed = 0.15;
        
        const mobileTerminalTransform = scrollTop * mobileTerminalSpeed;
        const mobileIconTransform = scrollTop * mobileIconSpeed;
        const mobileContentTransform = scrollTop * mobileContentSpeed;
        
        if (this.mobileTerminals.terminal1) {
          this.mobileTerminals.terminal1.style.transform = `translate3d(0, ${mobileTerminalTransform}px, 0)`;
        }
        if (this.mobileTerminals.terminal2) {
          this.mobileTerminals.terminal2.style.transform = `translate3d(0, ${mobileTerminalTransform}px, 0)`;
        }
        
        this.floatingIcons.forEach((icon, index) => {
          const variation = (index % 2) * 0.05;
          const iconTransformWithVariation = mobileIconTransform + (scrollTop * variation);
          icon.style.transform = `translate3d(0, ${iconTransformWithVariation}px, 0)`;
        });
        
        if (this.heroContent) {
          this.heroContent.style.transform = `translate3d(0, -${mobileContentTransform}px, 0)`;
        }
        
        if (this.todoList) {
          this.todoList.style.transform = `translate3d(0, ${mobileTerminalTransform * 0.7}px, 0)`;
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
    const elements = [
      this.terminals.left,
      this.terminals.right, 
      this.terminals.mac,
      this.todoList,
      this.heroContent,
      this.mobileTerminals.terminal1,
      this.mobileTerminals.terminal2
    ];
    
    elements.forEach(el => {
      if (el) el.style.transform = '';
    });
    
    this.floatingIcons.forEach(icon => {
      icon.style.transform = '';
    });
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}



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



// Text on Tread Animation Implementation
function initTextOnTread() {
  const root = document.getElementById('text-tread-root');
  if (!root) return;
  
  const text = "EAT CODE SLEEP REPEAT";
  const duration = 8000; // in ms
  const treadLength = 44.57;
  const treadFragments = 80;
  const treadFragmentWidth = treadLength / treadFragments;
  
  // Create the main container
  const totContainer = document.createElement('div');
  totContainer.className = 'tot';
  
  // Create front layer
  const frontLayer = createTreadLayer(text, treadFragments, treadFragmentWidth, duration, false);
  
  // Create back layer
  const backLayer = createTreadLayer(text, treadFragments, treadFragmentWidth, duration, true);
  backLayer.setAttribute('aria-hidden', 'true');
  
  totContainer.appendChild(frontLayer);
  totContainer.appendChild(backLayer);
  root.appendChild(totContainer);
}

function createTreadLayer(text, treadFragments, treadFragmentWidth, duration, isBack) {
  const layer = document.createElement('div');
  layer.className = 'tot__layer';
  layer.textContent = text;
  
  // Create tread fragments
  for (let f = 0; f < treadFragments; f++) {
    const percent = f / treadFragments;
    const moveX = f * treadFragmentWidth;
    
    const delay = isBack 
      ? -duration + (percent * duration)
      : -duration + ((percent - 0.5) * duration);
    
    const finalMoveX = isBack ? -moveX : moveX;
    
    const treadFragment = createTreadFragment(text, duration, delay, finalMoveX, treadFragmentWidth);
    layer.appendChild(treadFragment);
  }
  
  return layer;
}

function createTreadFragment(text, duration, delay, moveX, width) {
  const tread = document.createElement('div');
  tread.className = 'tot__tread';
  tread.style.animationDuration = `${duration}ms`;
  tread.style.animationDelay = `${delay}ms`;
  tread.style.width = `calc(${width}rem + 1px)`;
  
  const window = document.createElement('div');
  window.className = 'tot__tread-window';
  window.setAttribute('aria-hidden', 'true');
  window.setAttribute('data-text', text);
  window.style.transform = `translateX(${moveX}rem)`;
  
  tread.appendChild(window);
  return tread;
}

// Animated Grid Implementation
function initAnimatedGrid() {
  const svg = document.querySelector('.animated-grid-cell svg');
  if (!svg) return;
  
  const pts = [];
  const boxes = [];
  const props = {
    width: 22,
    height: 29,
    size: 4.5
  };

  // Setup grid points
  for (let x = 0, i = 0; x < props.width; x++) {
    for (let y = 0; y < props.height; y++) {
      if (i % props.height < props.height - 1 && i < props.width * props.height - props.height) {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svg.appendChild(p);
        boxes[i] = p;
        
        // Set fill color
        const fillColor = y % Math.ceil(props.size / 2) ? '#36c' : 'skyblue';
        p.setAttribute('fill', fillColor);
      }
      pts[i] = { i: i, x: x * props.size, y: y * props.size };
      pts[i].baseX = pts[i].x;
      pts[i].baseY = pts[i].y;
      i++;
    }
  }

  // Set initial positions
  pts.forEach((pt, i) => {
    pt.x = pt.baseX + (pt.baseY % (props.size * 2) * 2);
  });

  // Animation function
  function animateGrid() {
    const duration = 2000; // 2 seconds
    const staggerAmount = 5000; // 5 seconds total stagger
    
    pts.forEach((pt, i) => {
      const staggerDelay = (i / pts.length) * staggerAmount;
      const totalDuration = duration + staggerAmount;
      
      // Create oscillating motion
      setInterval(() => {
        const time = (Date.now() + staggerDelay) / 1000;
        const oscillation = Math.sin(time * Math.PI / duration) * props.size * 2;
        pt.y = pt.baseY - oscillation;
        drawBoxes();
      }, 16); // ~60fps
    });
  }

  function drawBoxes() {
    boxes.forEach((b, i) => {
      if (b && pts[i] && pts[i + 1] && pts[i + 1 + props.height] && pts[i + props.height]) {
        let pathData = 
          ' M' + pts[i].x + ',' + pts[i].y +
          ' L' + pts[i + 1].x + ',' + pts[i + 1].y +
          ' L' + pts[i + 1 + props.height].x + ',' + pts[i + 1 + props.height].y +
          ' L' + pts[i + props.height].x + ',' + pts[i + props.height].y + 'z';
        b.setAttribute('d', pathData);
      }
    });
  }

  // Start animation
  drawBoxes();
  animateGrid();
}

