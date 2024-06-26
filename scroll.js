document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for fade-in effect
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    function onIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }

    const observer = new IntersectionObserver(onIntersection, observerOptions);
    const elementsToObserve = document.querySelectorAll('.scroll-fade');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });

    // Handle section toggling
    const links = document.querySelectorAll('.secc a');
    const sections = document.querySelectorAll('.seccright');
    let activeSection = null;

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (activeSection === targetSection) {
                collapseSection(targetSection, link);
            } else {
                sections.forEach(section => {
                    section.classList.remove('active');
                    section.classList.add('fade-out');
                });
                links.forEach(link => link.classList.remove('active'));

                link.classList.add('active');
                targetSection.classList.remove('fade-out');
                targetSection.classList.add('active');
                activeSection = targetSection;
            }
        });
    });

    function collapseSection(section, link) {
        section.classList.remove('active');
        section.classList.add('fade-out');
        link.classList.remove('active');
        activeSection = null;
    }

    // Handle expand/collapse of right panels
    function handleViewMoreClick(pageId, viewMoreLinkId, rightPanelId) {
        const viewMoreLink = document.getElementById(viewMoreLinkId);
        const rightPanel = document.getElementById(rightPanelId);
        const container = document.getElementById('container');

        let isExpanded = false;

        function expandSection() {
            document.querySelector(`#${pageId} .title_sec3`).style.transform = 'translateX(-25vw)';
            document.querySelector(`#${pageId} .view_sec3`).style.transform = 'translateX(-25vw)';
            document.querySelector(`#${pageId} .sub_sec3`).style.display = 'none';

            isExpanded = true;
            rightPanel.classList.add('visible');
            container.classList.add('no-scroll');
            rightPanel.style.overflowY = 'auto';
            rightPanel.scrollTop = 0;
            rightPanel.addEventListener('scroll', handlePanelScroll);
        }

        function collapseSection() {
            document.querySelector(`#${pageId} .title_sec3`).style.transform = 'translateX(0)';
            document.querySelector(`#${pageId} .view_sec3`).style.transform = 'translateX(0)';
            document.querySelector(`#${pageId} .sub_sec3`).style.display = 'block';

            isExpanded = false;
            rightPanel.classList.remove('visible');
            container.classList.remove('no-scroll');
            rightPanel.scrollTop = 0;
        }

        function handlePanelScroll(event) {
            event.stopPropagation();
        }

        viewMoreLink.addEventListener('click', function(event) {
            event.preventDefault();
            isExpanded ? collapseSection() : expandSection();
        });

        const leftPanel = document.getElementById(pageId);
        leftPanel.addEventListener('click', function(event) {
            if (isExpanded && event.target !== viewMoreLink) {
                collapseSection();
            }
        });

        container.addEventListener('scroll', function() {
            if (isExpanded && container.scrollTop > 0) {
                collapseSection();
            }
        });

        rightPanel.addEventListener('wheel', function(event) {
            event.stopPropagation();
        });
    }

    // Initialize right panel expand/collapse functionality
    handleViewMoreClick('page3', 'viewMoreLink3', 'rightPanel3');
    handleViewMoreClick('page4', 'viewMoreLink4', 'rightPanel4');
    handleViewMoreClick('page5', 'viewMoreLink5', 'rightPanel5');
    handleViewMoreClick('page6', 'viewMoreLink6', 'rightPanel6');

    // GSAP animations with ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    const fadeElements = document.querySelectorAll('.scroll-fade');
    fadeElements.forEach(element => {
        const scene = new ScrollMagic.Scene({
            triggerElement: element,
            triggerHook: 0.9,
        })
        .setClassToggle(element, 'visible')
        .addTo(new ScrollMagic.Controller());
    });

    // Update progress bar as user scrolls through right panel
    function updateProgressBar(panelId, progressBarId) {
        const rightPanel = document.getElementById(panelId);
        const progressBar = document.getElementById(progressBarId);
        const container = document.getElementById('container');

        rightPanel.addEventListener('scroll', function() {
            const scrollTop = rightPanel.scrollTop;
            const scrollHeight = rightPanel.scrollHeight - rightPanel.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });

        container.addEventListener('scroll', function() {
            if (rightPanel.classList.contains('visible') && container.scrollTop > 0) {
                collapseSection();
                progressBar.style.width = '0%'; // Reset progress bar width
            }
        });

        function handlePanelScroll(event) {
            event.stopPropagation();
        }

        function collapseSection() {
            const titleSec3 = document.querySelector(`#${panelId} .title_sec3`);
            const viewSec3 = document.querySelector(`#${panelId} .view_sec3`);
            const subSec3 = document.querySelector(`#${panelId} .sub_sec3`);

            titleSec3.style.transform = 'translateX(0)';
            viewSec3.style.transform = 'translateX(0)';
            subSec3.style.display = 'block';

            isExpanded = false;
            rightPanel.classList.remove('visible');
            container.classList.remove('no-scroll');
            rightPanel.scrollTop = 0;
            progressBar.style.width = '0%'; // Reset progress bar width
        }
    }

    // Initialize progress bar updates for each right panel
    updateProgressBar('rightPanel3', 'progressBar3');
    updateProgressBar('rightPanel4', 'progressBar4');
    updateProgressBar('rightPanel5', 'progressBar5');
    updateProgressBar('rightPanel6', 'progressBar6');
});

