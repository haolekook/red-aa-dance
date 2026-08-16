const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Animation state
let isPlaying = true;
let animationTime = 0;
const speed = 0.02;

// Dancing Fan Man Object
class DancingFanMan {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.fanRadius = 40;
        this.bodyRotation = 0;
        this.leftLegAngle = 0;
        this.rightLegAngle = 0;
        this.swayAmount = 0;
    }

    updateAnimation(time) {
        // Body sway
        this.swayAmount = Math.sin(time * 0.04) * 15;
        
        // Leg dance movements
        this.leftLegAngle = Math.sin(time * 0.08) * 0.6 + 0.3;
        this.rightLegAngle = Math.sin(time * 0.08 + Math.PI) * 0.6 + 0.3;
        
        // Body rotation for groovy movement
        this.bodyRotation = Math.sin(time * 0.03) * 0.15;
    }

    draw() {
        ctx.save();
        
        // Move to fan man position
        ctx.translate(this.x, this.y);
        ctx.rotate(this.bodyRotation);

        // Draw legs first (behind the fan)
        this.drawLegs();
        
        // Draw fan body
        this.drawFan();

        ctx.restore();
    }

    drawFan() {
        // Fan tube body (black cylinder-like shape)
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(0, -20, 35, 50, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fan blades (animated rotation)
        this.drawFanBlades();

        // Fan head
        ctx.fillStyle = '#2d2d2d';
        ctx.beginPath();
        ctx.arc(0, -65, this.fanRadius, 0, Math.PI * 2);
        ctx.fill();

        // Fan grill (decorative lines)
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        for (let i = -this.fanRadius + 10; i <= this.fanRadius - 10; i += 8) {
            ctx.beginPath();
            ctx.moveTo(i, -65 - Math.sqrt(this.fanRadius ** 2 - i ** 2));
            ctx.lineTo(i, -65 + Math.sqrt(this.fanRadius ** 2 - i ** 2));
            ctx.stroke();
        }

        // Fan details
        ctx.fillStyle = '#444';
        ctx.beginPath();
        ctx.arc(0, -65, this.fanRadius - 3, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawFanBlades() {
        const bladeCount = 3;
        const bladeRotation = animationTime * 0.15; // Spinning blades
        
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';

        for (let i = 0; i < bladeCount; i++) {
            const angle = (i / bladeCount) * Math.PI * 2 + bladeRotation;
            const x1 = Math.cos(angle) * 15;
            const y1 = Math.sin(angle) * 15 - 65;
            const x2 = Math.cos(angle) * 28;
            const y2 = Math.sin(angle) * 28 - 65;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    drawLegs() {
        const legLength = 60;
        const legWidth = 12;
        const hipOffset = 15;

        // Left leg
        ctx.save();
        ctx.translate(-hipOffset, 40);
        ctx.rotate(this.leftLegAngle);
        ctx.fillStyle = '#333';
        ctx.fillRect(-legWidth / 2, 0, legWidth, legLength);
        
        // Left foot
        ctx.fillStyle = '#444';
        ctx.fillRect(-legWidth / 2 - 5, legLength, legWidth + 10, 15);
        ctx.restore();

        // Right leg
        ctx.save();
        ctx.translate(hipOffset, 40);
        ctx.rotate(this.rightLegAngle);
        ctx.fillStyle = '#333';
        ctx.fillRect(-legWidth / 2, 0, legWidth, legLength);
        
        // Right foot
        ctx.fillStyle = '#444';
        ctx.fillRect(-legWidth / 2 - 5, legLength, legWidth + 10, 15);
        ctx.restore();
    }
}

// Create dancing fan man
const dancer = new DancingFanMan();

// Animation loop
function animate() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isPlaying) {
        animationTime += speed;
        dancer.updateAnimation(animationTime);
    }

    dancer.draw();

    // Draw some groovy background elements
    drawParticles();

    requestAnimationFrame(animate);
}

// Particle effects
let particles = [];

function drawParticles() {
    // Create particles occasionally
    if (Math.random() < 0.3 && isPlaying) {
        particles.push({
            x: dancer.x + (Math.random() - 0.5) * 80,
            y: dancer.y - 100 + Math.random() * 50,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 1,
            size: Math.random() * 3 + 2
        });
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy -= 0.1; // Gravity

        if (p.life > 0) {
            ctx.fillStyle = `rgba(255, 200, 100, ${p.life * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            particles.splice(i, 1);
        }
    }
}

// Controls
document.getElementById('toggleBtn').addEventListener('click', () => {
    isPlaying = !isPlaying;
});

document.getElementById('resetBtn').addEventListener('click', () => {
    animationTime = 0;
    particles = [];
});

// Start animation
animate();
