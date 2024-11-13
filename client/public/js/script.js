const canvas = document.getElementById('labCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.8;

let mass = 5; // Default mass in kg
let gravity = 9.8; // Gravity in m/s²
let force = 20; // Force in Newtons (N)
let angle = 270; // Angle in degrees (circular slider will modify this)
let acceleration = 0; // Acceleration in m/s²
let velocityX = 0; // Velocity in m/s (horizontal)
let velocityY = 0; // Velocity in m/s (vertical)
let positionX = canvas.width/2; // Initial position of the object (horizontal)
let positionY = canvas.height - 40; // Initial position of the object (vertical)
let isForceApplied = false;
const friction = 0.99; // Friction to slow down

// Update control values
document.getElementById('massInput').addEventListener('input', function(e) {
    mass = parseFloat(e.target.value);
    document.getElementById('massDisplay').textContent = `Mass: ${mass} kg`;
});

document.getElementById('gravityInput').addEventListener('input', function(e) {
    gravity = parseFloat(e.target.value) * 9.8; // Scale gravity for simulation
    document.getElementById('gravityDisplay').textContent = `Gravity: ${gravity.toFixed(1)} m/s²`;
});

document.getElementById('forceInput').addEventListener('input', function(e) {
    force = parseFloat(e.target.value);
    document.getElementById('forceDisplay').textContent = `Force: ${force.toFixed(2)} N`;
});

const circularSlider = document.getElementById('circular-slider');
const handle = document.getElementById('handle');

// Calculate the center of the circular slider
let centerX = circularSlider.offsetWidth / 2;
let centerY = circularSlider.offsetHeight / 2;

circularSlider.addEventListener('mousedown', startDrag);

function startDrag(e) {
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    onDrag(e);  // Call it once to start
}

function onDrag(e) {
    const rect = circularSlider.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - centerX;
    const mouseY = e.clientY - rect.top - centerY;

    // Calculate the angle based on the mouse position
    angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    if (angle < 0) angle += 360; // Ensure angle is positive

    // Update handle position using polar coordinates to move around the circle
    const radianAngle = (angle * Math.PI) / 180;
    const handleX = centerX + (centerX - 10) * Math.cos(radianAngle); // Subtracting 10 to center the handle on the circle's edge
    const handleY = centerY + (centerY - 10) * Math.sin(radianAngle);

    handle.style.left = `${handleX}px`;
    handle.style.top = `${handleY}px`;

    document.getElementById('angleDisplay').textContent = `Angle: ${Math.round(angle)}°`;
}

function stopDrag() {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
}

document.getElementById('applyForce').addEventListener('click', function() {
    // Convert angle to radians
    const angleInRadians = (angle * Math.PI) / 180;

    // Split the force into components (Fx, Fy) based on the angle
    const Fx = force * Math.cos(angleInRadians);
    const Fy = force * Math.sin(angleInRadians);

    // Correct the Y component to account for the flipped canvas Y-axis
    // In canvas, positive Y is down, so we flip the Fy sign
    const correctedFy = -Fy;

    // Apply the force (Newton's Second Law: F = ma, so a = F / m)
    const accelerationX = Fx / mass;
    const accelerationY = correctedFy / mass;

    // Update the velocity components based on the applied force
    velocityX += accelerationX;
    velocityY -= accelerationY;

    document.getElementById('forceInfo').textContent = `${force.toFixed(2)} N applied at ${Math.round(angle)}°`;

    isForceApplied = true;
});


// Draw the object
function drawObject() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(positionX, positionY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#3498db';
    ctx.fill();
    ctx.closePath();
}

// Update the physics
function updatePhysics() {
    if (isForceApplied) {
        // Apply gravity to vertical velocity
        velocityY += gravity / 60;

        // Apply friction to both horizontal and vertical velocities
        velocityX *= friction;
        velocityY *= friction;

        // Update position
        positionX += velocityX;
        positionY += velocityY;

        // Boundary detection (to prevent the object from moving off the screen)
        if (positionY + 30 > canvas.height) {
            positionY = canvas.height - 30;
            velocityY = -velocityY * 0.8; // Bounce with reduced velocity
        }

        if (positionX + 30 > canvas.width || positionX - 30 < 0) {
            velocityX = -velocityX * 0.8; // Bounce off the sides
        }
    }

    // Update the info panel
    document.getElementById('velocityDisplay').textContent = `${Math.sqrt(velocityX ** 2 + velocityY ** 2).toFixed(2)} m/s`;
    document.getElementById('accelerationDisplay').textContent = `${Math.sqrt((velocityX ** 2) + (velocityY ** 2)).toFixed(2)} m/s²`;
}



// Main animation loop
function animate() {
    drawObject();
    updatePhysics();
    requestAnimationFrame(animate);
}

animate();
