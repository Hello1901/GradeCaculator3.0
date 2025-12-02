// Grade Grapher with Chart.js
import { isAuthenticated } from './auth.js';

let chart = null;

// Check if user can access grapher
export function canAccessGrapher() {
    return isAuthenticated();
}

// Add grade entry row
export function addGradeEntry() {
    const container = document.getElementById('gradeEntriesContainer');
    const entryCount = container.children.length + 1;

    const entryDiv = document.createElement('div');
    entryDiv.className = 'grade-entry';
    entryDiv.innerHTML = `
        <div class="entry-number">#${entryCount}</div>
        <div class="input-group">
            <label class="input-label">Grade (1-5):</label>
            <input type="number" class="input-field grade-value" min="1" max="5" step="0.1" placeholder="4.5">
        </div>
        <div class="input-group">
            <label class="input-label">Weight (%):</label>
            <input type="number" class="input-field grade-weight" min="0" max="200" placeholder="100">
        </div>
        <button class="btn-remove" onclick="removeGradeEntry(this)">✕</button>
    `;

    container.appendChild(entryDiv);
}

// Remove grade entry row
window.removeGradeEntry = function (button) {
    const entry = button.closest('.grade-entry');
    entry.remove();
    updateEntryNumbers();
};

// Update entry numbers after removal
function updateEntryNumbers() {
    const entries = document.querySelectorAll('.grade-entry');
    entries.forEach((entry, index) => {
        entry.querySelector('.entry-number').textContent = `#${index + 1}`;
    });
}

// Calculate weighted average
function calculateWeightedAverage(grades, weights) {
    let totalWeightedGrade = 0;
    let totalWeight = 0;

    for (let i = 0; i < grades.length; i++) {
        totalWeightedGrade += grades[i] * weights[i];
        totalWeight += weights[i];
    }

    return totalWeight > 0 ? totalWeightedGrade / totalWeight : 0;
}

// Generate graph
export function generateGraph() {
    const entries = document.querySelectorAll('.grade-entry');

    if (entries.length === 0) {
        showNotification('warning', 'Please add at least one grade entry');
        return;
    }

    const grades = [];
    const weights = [];
    const labels = [];

    // Collect data from entries
    entries.forEach((entry, index) => {
        const gradeValue = parseFloat(entry.querySelector('.grade-value').value);
        const gradeWeight = parseFloat(entry.querySelector('.grade-weight').value);

        if (isNaN(gradeValue) || isNaN(gradeWeight)) {
            showNotification('warning', `Entry #${index + 1}: Please fill in all fields`);
            return;
        }

        if (gradeValue < 1 || gradeValue > 5) {
            showNotification('warning', `Entry #${index + 1}: Grade must be between 1 and 5`);
            return;
        }

        grades.push(gradeValue);
        weights.push(gradeWeight);
        labels.push(`Entry ${index + 1}`);
    });

    if (grades.length === 0) {
        return;
    }

    // Calculate weighted average
    const average = calculateWeightedAverage(grades, weights);

    // Create cumulative average data
    const cumulativeAverages = [];
    for (let i = 0; i < grades.length; i++) {
        const subGrades = grades.slice(0, i + 1);
        const subWeights = weights.slice(0, i + 1);
        cumulativeAverages.push(calculateWeightedAverage(subGrades, subWeights));
    }

    // Destroy existing chart if any
    if (chart) {
        chart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById('gradeChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Grade Progression',
                data: cumulativeAverages,
                borderColor: '#96A78D',
                backgroundColor: 'rgba(150, 167, 141, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#96A78D',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Weighted Average: ${average.toFixed(2)}`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Average: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Show chart container
    document.getElementById('chartContainer').style.display = 'block';
    showNotification('success', `Graph generated! Weighted average: ${average.toFixed(2)}`);
}

// Download chart as image
export function downloadChart(format = 'png') {
    if (!chart) {
        showNotification('warning', 'Please generate a graph first');
        return;
    }

    const link = document.createElement('a');
    link.download = `grade-graph.${format}`;

    if (format === 'jpg' || format === 'jpeg') {
        link.href = chart.toBase64Image('image/jpeg', 1.0);
    } else {
        link.href = chart.toBase64Image();
    }

    link.click();
    showNotification('success', `Graph downloaded as ${format.toUpperCase()}`);
}

// Make functions globally available
window.addGradeEntry = addGradeEntry;
window.generateGraph = generateGraph;
window.downloadChart = downloadChart;
