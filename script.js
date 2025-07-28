// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Appointment booking functionality
    initializeAppointmentForm();
    
    // FAQ functionality
    initializeFAQ();
    
    // Contact form functionality
    initializeContactForm();
    
    // Set minimum date for appointment booking
    setMinimumDate();
});

// Appointment form variables
let currentStep = 1;
const totalSteps = 4;

function initializeAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (!appointmentForm) return;
    
    // Handle form submission
    appointmentForm.addEventListener('submit', handleAppointmentSubmission);
    
    // Add event listeners for form validation
    addFormValidationListeners();
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            
            if (currentStep === 4) {
                updateBookingSummary();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
    }
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateServiceSelection();
        case 2:
            return validateDateTimeSelection();
        case 3:
            return validatePersonalInfo();
        default:
            return true;
    }
}

function validateServiceSelection() {
    const selectedService = document.querySelector('input[name="service"]:checked');
    if (!selectedService) {
        showNotification('Please select a service before continuing.', 'error');
        return false;
    }
    return true;
}

function validateDateTimeSelection() {
    const selectedDate = document.getElementById('appointmentDate').value;
    const selectedTime = document.querySelector('input[name="appointmentTime"]:checked');
    
    if (!selectedDate) {
        showNotification('Please select a date for your appointment.', 'error');
        return false;
    }
    
    if (!selectedTime) {
        showNotification('Please select a time slot for your appointment.', 'error');
        return false;
    }
    
    // Validate that the selected date is not in the past
    const today = new Date();
    const appointmentDate = new Date(selectedDate);
    
    if (appointmentDate < today.setHours(0,0,0,0)) {
        showNotification('Please select a future date for your appointment.', 'error');
        return false;
    }
    
    return true;
}

function validatePersonalInfo() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!firstName || !lastName || !email || !phone) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

function updateBookingSummary() {
    // Update service details
    const selectedService = document.querySelector('input[name="service"]:checked');
    if (selectedService) {
        document.getElementById('selectedService').textContent = selectedService.value;
        
        // Extract and display price
        const priceMatch = selectedService.value.match(/\$(\d+)/);
        if (priceMatch) {
            document.getElementById('totalAmount').textContent = `$${priceMatch[1]}`;
        }
    }
    
    // Update date and time
    const selectedDate = document.getElementById('appointmentDate').value;
    const selectedTime = document.querySelector('input[name="appointmentTime"]:checked');
    if (selectedDate && selectedTime) {
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('selectedDateTime').textContent = 
            `${formattedDate} at ${selectedTime.value}`;
    }
    
    // Update client information
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    document.getElementById('clientInfo').innerHTML = `
        <strong>${firstName} ${lastName}</strong><br>
        ${email}<br>
        ${phone}
    `;
}

function handleAppointmentSubmission(e) {
    e.preventDefault();
    
    const policyAgreed = document.querySelector('input[name="agreePolicy"]:checked');
    if (!policyAgreed) {
        showNotification('Please agree to the cancellation policy and terms of service.', 'error');
        return;
    }
    
    // Show success message
    showNotification('Appointment booked successfully! We will send you a confirmation email shortly.', 'success');
    
    // Reset form after a delay
    setTimeout(() => {
        resetAppointmentForm();
    }, 3000);
}

function resetAppointmentForm() {
    document.getElementById('appointmentForm').reset();
    currentStep = 1;
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
}

function addFormValidationListeners() {
    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }
}

function setMinimumDate() {
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate contact form
        if (validateContactForm()) {
            showNotification('Message sent successfully! We will get back to you within 24 hours.', 'success');
            contactForm.reset();
        }
    });
}

function validateContactForm() {
    const firstName = document.querySelector('#contactForm #firstName')?.value.trim();
    const lastName = document.querySelector('#contactForm #lastName')?.value.trim();
    const email = document.querySelector('#contactForm #email')?.value.trim();
    const subject = document.querySelector('#contactForm #subject')?.value;
    const message = document.querySelector('#contactForm #message')?.value.trim();
    
    if (!firstName || !lastName || !email || !subject || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatPhoneNumber(value) {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length >= 3) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
        return cleaned;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        font-family: 'Poppins', sans-serif;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for forms
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Initialize tooltips for form help
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTooltips);

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .value-card, .team-member, .package-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Global variables for form state
window.nextStep = nextStep;
window.prevStep = prevStep;