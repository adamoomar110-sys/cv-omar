document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple typing effect for hero title
    const typingText = document.querySelector('.typing-text');
    const text = typingText.innerText;
    typingText.innerText = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typingText.append(text.charAt(i));
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after brief delay
    setTimeout(typeWriter, 1000);

    // Glitch effect hover triggers can be added here if needed

    // AI Evaluator Logic
    const questions = [
        {
            level: "Nivel 1 (Fundamentos)",
            text: "¿Cuál es el propósito de HTML5 semántico en el desarrollo web moderno?",
            options: [
                "Añadir colores y animaciones directamente al texto.",
                "Estructurar el contenido para mejorar el SEO y la accesibilidad.",
                "Crear bases de datos en el navegador.",
                "Ejecutar agentes autónomos."
            ],
            correct: 1
        },
        {
            level: "Nivel 3 (Backend)",
            text: "¿Qué rol juega un sistema de Testing como 'Unittest' en el código Python de Omar?",
            options: [
                "Garantiza que el código nuevo no rompa las funcionalidades existentes.",
                "Hackea la base de datos de los competidores.",
                "Aumenta la velocidad de carga del CSS.",
                "Traduce código Python a C++."
            ],
            correct: 0
        },
        {
            level: "Nivel 5 (IA - RAG)",
            text: "En el proyecto 'Libris', ¿para qué se utiliza la arquitectura RAG (Retrieval-Augmented Generation)?",
            options: [
                "Para hacer que la interfaz de usuario sea más bonita.",
                "Para generar respuestas de IA basadas exclusivamente en documentos técnicos propios, evitando alucinaciones.",
                "Para cobrar pagos recurrentes con Stripe.",
                "Para enviar mensajes OTP por WhatsApp."
            ],
            correct: 1
        },
        {
            level: "Nivel 6 (Agentes Autónomos)",
            text: "Si necesitas un sistema donde varios agentes razonen, colaboren y usen herramientas (ej. Filtro o RolPlay.ai), ¿qué usas?",
            options: [
                "Solo HTML y CSS.",
                "Una base de datos SQL normal.",
                "Un framework de agentes como LangChain o CrewAI integrado con LLMs.",
                "Excel y macros en VBA."
            ],
            correct: 2
        },
        {
            level: "Nivel 7 (DevOps & Deploy)",
            text: "¿Cuál es el beneficio de contenerizar aplicaciones complejas de IA con Docker?",
            options: [
                "Genera más tokens gratis en los LLM.",
                "Sustituye la necesidad de usar control de versiones como Git.",
                "Garantiza un entorno idéntico en desarrollo y producción aislando dependencias (ej: PyTorch, Pandas).",
                "Reemplaza directamente a las bases de datos SQL."
            ],
            correct: 2
        },
        {
            level: "Nivel 8 (Arquitectura & Optimización)",
            text: "¿Cómo se maneja eficientemente el asincronismo en Python para no bloquear el hilo principal (GIL) durante lecturas de I/O masivas?",
            options: [
                "Aumentando la memoria RAM del servidor web.",
                "Mediante la librería 'asyncio' procesando tareas no-bloqueantes de forma concurrente.",
                "Escribiendo todo el código en un único archivo sin funciones.",
                "Ejecutando time.sleep() en medio de los endpoints."
            ],
            correct: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    const startBtn = document.getElementById('start-test-btn');
    const restartBtn = document.getElementById('restart-test-btn');
    const testBody = document.getElementById('test-body');
    const questionContainer = document.getElementById('test-question-container');
    const resultsContainer = document.getElementById('test-results');
    
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressBar = document.getElementById('progress-bar');
    
    const scoreText = document.getElementById('score-text');
    const aiRecommendation = document.getElementById('ai-recommendation');

    startBtn.addEventListener('click', startTest);
    restartBtn.addEventListener('click', startTest);

    function startTest() {
        currentQuestion = 0;
        score = 0;
        testBody.style.display = 'none';
        resultsContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        loadQuestion();
    }

    function loadQuestion() {
        optionsContainer.innerHTML = '';
        const q = questions[currentQuestion];
        
        questionText.innerHTML = `<span style="color: var(--primary-color); font-size:0.9rem">[${q.level}]</span><br>${q.text}`;
        
        progressBar.style.width = `${((currentQuestion) / questions.length) * 100}%`;

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.addEventListener('click', () => selectOption(index, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(selectedIndex, btnElement) {
        // Disable all buttons
        const allBtns = optionsContainer.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        const q = questions[currentQuestion];
        
        if (selectedIndex === q.correct) {
            btnElement.classList.add('correct');
            score++;
        } else {
            btnElement.classList.add('wrong');
            allBtns[q.correct].classList.add('correct');
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }, 1500);
    }

    function showResults() {
        questionContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        progressBar.style.width = '100%';

        const percentage = (score / questions.length) * 100;
        scoreText.innerText = `Precisión: ${percentage}% (${score}/${questions.length})`;

        let recommendation = "";
        
        if (percentage === 100) {
            recommendation = "<strong>Análisis:</strong> Excelente comprensión técnica.<br><br><strong>Recomendación IA:</strong> El perfil de Omar se ajusta perfectamente a las necesidades de tus proyectos avanzados de Inteligencia Artificial. Sugiero pactar una entrevista técnica lo antes posible.";
        } else if (percentage >= 50) {
            recommendation = "<strong>Análisis:</strong> Buen nivel de comprensión general, aunque hay detalles técnicos sobre Agentes o RAG que pueden profundizarse.<br><br><strong>Recomendación IA:</strong> Omar tiene la experiencia concreta en estos sistemas (Filtro, Libris). Contratarlo ahorrará meses de investigación a tu equipo.";
        } else {
            recommendation = "<strong>Análisis:</strong> Parece que el ecosistema de IA moderna y desarrollo Full-Stack es nuevo para ti.<br><br><strong>Recomendación IA:</strong> La curva de aprendizaje desde cero hasta Arquitecto de Agentes es pronunciada. Incorporar a Omar Adamo acelerará tu producto de IA inmediatamente.";
        }

        aiRecommendation.innerHTML = recommendation;
    }

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        cursorGlow.style.top = `${e.clientY}px`;
        cursorGlow.style.left = `${e.clientX}px`;
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .ai-card, .option-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(2)';
            cursor.style.background = 'white';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(2)', '');
            cursor.style.background = 'var(--primary-color)';
        });
    });

});
