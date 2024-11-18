// Canvas setup with proper scaling
const canvas = document.getElementById('labCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight - 100;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Physics simulation state with adjusted constants
const state = {
    mass: 5,
    gravity: 9.8,
    force: 20,
    angle: 0,
    acceleration: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    isForceApplied: false,
    friction: 0.995,  // Reduced friction (was 0.99)
    elasticity: 0.8,  // Increased elasticity (was 0.7)
    timeStep: 1/60,
    forceAppliedTime: 0,
    maxForceTime: 0.1,  // Reduced force application time (was 0.5)
    forceMagnitudeFactor: 0.5  // New scaling factor for force
};

function resetPosition() {
    state.position.x = canvas.width / 2;
    state.position.y = canvas.height - 40;
    state.velocity.x = 0;
    state.velocity.y = 0;
    state.acceleration.x = 0;
    state.acceleration.y = 0;
    state.isForceApplied = false;
}

resetPosition();

// Save the current state to local storage
async function saveState() {
    const stateName = prompt("Enter a name for the saved state:");
    if (!stateName) return;

    const stateToSave = {
        name: stateName,
        mass: state.mass,
        gravity: state.gravity,
        force: state.force,
        angle: state.angle,
        friction: state.friction,
        position: state.position,
        velocity: state.velocity,
        acceleration: state.acceleration
    };

    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to save a state.');
        return;
    }

    try {
        const response = await fetch('/api/states/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(stateToSave)
        });

        if (response.ok) {
            alert('State saved successfully!');
            updateSavedStatesDropdown();
        } else {
            const errorText = await response.text();
            console.error('Failed to save state:', errorText);
            alert('Failed to save state: ' + errorText);
        }
    } catch (error) {
        console.error('Error saving state:', error);
        alert('An error occurred while saving the state. Please try again.');
    }
}

// Load the state from local storage
function loadState() {
    const stateName = document.getElementById('saveStatesDropdown').value;
    if (!stateName) {
        alert('Please select a saved state.');
        return;
    }

    const savedStates = JSON.parse(localStorage.getItem('savedStates'));
    const stateToLoad = savedStates[stateName];

    state.mass = stateToLoad.mass;
    state.gravity = stateToLoad.gravity;
    state.force = stateToLoad.force;
    state.angle = stateToLoad.angle;
    state.friction = stateToLoad.friction;
    state.position = stateToLoad.position;
    state.velocity = stateToLoad.velocity;
    state.acceleration = stateToLoad.acceleration;

    // Update UI elements to reflect loaded state
    document.getElementById('massInput').value = state.mass;
    document.getElementById('massDisplay').textContent = `${state.mass} kg`;
    document.getElementById('gravityInput').value = state.gravity / 9.8;
    document.getElementById('gravityDisplay').textContent = `${state.gravity.toFixed(1)} m/s²`;
    document.getElementById('forceInput').value = state.force;
    document.getElementById('forceDisplay').textContent = `${state.force} N`;
    document.getElementById('frictionInput').value = state.friction;
    document.getElementById('frictionDisplay').textContent = `${state.friction.toFixed(3)}`;
    updateHandlePosition(state.angle);

    alert('State loaded successfully!');
}

// Update the saved states dropdown menu
async function updateSavedStatesDropdown() {
    const savedStatesDropdown = document.getElementById('saveStatesDropdown');
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to load saved states.');
        return;
    }

    try {
        const response = await fetch('/api/states', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const savedStates = await response.json();

            // Clear existing options
            savedStatesDropdown.innerHTML = '<option value="">Select saved state...</option>';

            // Add options for each saved state
            savedStates.forEach(state => {
                const option = document.createElement('option');
                option.value = state.name;
                option.textContent = state.name;
                savedStatesDropdown.appendChild(option);
            });
        } else {
            const errorText = await response.text();
            console.error('Failed to load saved states:', errorText);
            alert('Failed to load saved states: ' + errorText);
        }
    } catch (error) {
        console.error('Error loading saved states:', error);
        alert('An error occurred while loading the saved states. Please try again.');
    }
}

// Add event listeners for save and load buttons
document.getElementById('save').addEventListener('click', saveState);
document.getElementById('load').addEventListener('click', loadState);

// Initialize the saved states dropdown on page load
document.addEventListener('DOMContentLoaded', updateSavedStatesDropdown);

// Circular slider handling (unchanged)
const circularSlider = document.querySelector('.circular-slider');
const handle = document.querySelector('.handle');
let isDragging = false;

function updateHandlePosition(angle) {
    const radius = circularSlider.offsetWidth / 2;
    const centerX = circularSlider.offsetWidth / 2 - 12;
    const centerY = circularSlider.offsetHeight / 2 - 12;
    const radians = (angle - 90) * (Math.PI / 180);
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    handle.style.left = `${x}px`;
    handle.style.top = `${y}px`;
    document.getElementById('angleDisplay').textContent = `${Math.round(angle)}°`;
}

function handleSliderInteraction(event) {
    const rect = circularSlider.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    state.angle = angle;
    updateHandlePosition(angle);
}

// Event listeners (unchanged)
circularSlider.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleSliderInteraction(e);
});

circularSlider.addEventListener('touchstart', (e) => {
    isDragging = true;
    handleSliderInteraction(e);
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) handleSliderInteraction(e);
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) handleSliderInteraction(e);
    e.preventDefault();
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

// Input handlers with adjusted scaling
document.getElementById('massInput').addEventListener('input', (e) => {
    state.mass = parseFloat(e.target.value);
    document.getElementById('massDisplay').textContent = `${state.mass} kg`;
});

document.getElementById('gravityInput').addEventListener('input', (e) => {
    state.gravity = parseFloat(e.target.value) * 9.8;
    document.getElementById('gravityDisplay').textContent = `${state.gravity.toFixed(1)} m/s²`;
});

document.getElementById('forceInput').addEventListener('input', (e) => {
    state.force = parseFloat(e.target.value);
    document.getElementById('forceDisplay').textContent = `${state.force} N`;
});

document.getElementById('frictionInput').addEventListener('input', (e) => {
    state.friction = parseFloat(e.target.value);
    document.getElementById('frictionDisplay').textContent = `${state.friction.toFixed(3)}`;
});

// Modified force application
document.getElementById('applyForce').addEventListener('click', () => {
    state.isForceApplied = true;
    state.forceAppliedTime = 0;
    
    const angleRad = (state.angle - 90) * (Math.PI / 180);
    
    // Scale force by mass and forceMagnitudeFactor
    const scaledForce = (state.force * state.forceMagnitudeFactor) / state.mass;
    
    // Apply initial velocity instead of acceleration
    state.velocity.x += Math.cos(angleRad) * scaledForce;
    state.velocity.y += Math.sin(angleRad) * scaledForce;
    
    document.getElementById('forceInfo').textContent = 
        `${state.force.toFixed(1)} N at ${Math.round(state.angle)}°`;
});

document.getElementById('reset').addEventListener('click', resetPosition);

// Modified physics update
function updatePhysics() {
    if (!state.isForceApplied) return;
    
    // Scale gravity effect
    const scaledGravity = state.gravity * 0.1; // Reduced gravity effect
    
    // Apply gravity to velocity directly
    state.velocity.y += scaledGravity * state.timeStep;
    
    // Apply friction
    state.velocity.x *= state.friction;
    state.velocity.y *= state.friction;
    
    // Update position
    state.position.x += state.velocity.x;
    state.position.y += state.velocity.y;
    
    // Boundary collisions with improved bounce
    const radius = 30;
    
    if (state.position.y + radius > canvas.height) {
        state.position.y = canvas.height - radius;
        state.velocity.y = -state.velocity.y * state.elasticity;
        // Apply additional horizontal friction on floor collision
        state.velocity.x *= 0.95;
    }
    
    if (state.position.y - radius < 0) {
        state.position.y = radius;
        state.velocity.y = -state.velocity.y * state.elasticity;
    }
    
    if (state.position.x + radius > canvas.width) {
        state.position.x = canvas.width - radius;
        state.velocity.x = -state.velocity.x * state.elasticity;
    }
    
    if (state.position.x - radius < 0) {
        state.position.x = radius;
        state.velocity.x = -state.velocity.x * state.elasticity;
    }
    
    // Update display values
    const speed = Math.sqrt(state.velocity.x ** 2 + state.velocity.y ** 2);
    const acceleration = Math.sqrt(state.acceleration.x ** 2 + state.acceleration.y ** 2);
    
    document.getElementById('velocityDisplay').textContent = `${speed.toFixed(2)} m/s`;
    document.getElementById('accelerationDisplay').textContent = `${acceleration.toFixed(2)} m/s²`;
}

// Drawing functions (unchanged)
function drawObject() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (state.isForceApplied && state.forceAppliedTime < state.maxForceTime) {
        const angleRad = (state.angle - 90) * (Math.PI / 180); // Adjusted to start from the right-hand side
        const arrowLength = 50;
        const arrowWidth = 10;
    
        // Calculate the end point of the arrow
        const endX = state.position.x + Math.cos(angleRad) * arrowLength;
        const endY = state.position.y + Math.sin(angleRad) * arrowLength;
    
        // Calculate the points for the arrowhead
        const headAngle1 = angleRad + Math.PI / 6;
        const headAngle2 = angleRad - Math.PI / 6;
        const headX1 = endX - Math.cos(headAngle1) * arrowWidth;
        const headY1 = endY - Math.sin(headAngle1) * arrowWidth;
        const headX2 = endX - Math.cos(headAngle2) * arrowWidth;
        const headY2 = endY - Math.sin(headAngle2) * arrowWidth;
    
        // Draw the arrow line
        ctx.beginPath();
        ctx.moveTo(state.position.x, state.position.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.stroke();
    
        // Draw the arrowhead
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(headX1, headY1);
        ctx.lineTo(headX2, headY2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fill();
    }
    
    ctx.beginPath();
    ctx.arc(state.position.x, state.position.y, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const speed = Math.sqrt(state.velocity.x ** 2 + state.velocity.y ** 2);
    if (speed > 0.1) {
        const angle = Math.atan2(state.velocity.y, state.velocity.x);
        ctx.beginPath();
        ctx.moveTo(state.position.x, state.position.y);
        ctx.lineTo(
            state.position.x + Math.cos(angle) * 30,
            state.position.y + Math.sin(angle) * 30
        );
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function animate() {
    updatePhysics();
    drawObject();
    requestAnimationFrame(animate);
}

updateHandlePosition(state.angle);
animate();