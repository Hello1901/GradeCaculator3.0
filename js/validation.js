// Grade Range Validation

// Validate a single grade range
export function validateGradeRange(min, max, gradeName) {
    const errors = [];

    // Check if values are numbers
    if (isNaN(min) || isNaN(max)) {
        errors.push(`${gradeName}: Please enter valid numbers`);
        return { valid: false, errors };
    }

    // Check if min < max
    if (min > max) {
        errors.push(`${gradeName}: Minimum (${min}%) cannot be greater than maximum (${max}%)`);
    }

    // Check if values are in valid range (0-100)
    if (min < 0 || min > 100) {
        errors.push(`${gradeName}: Minimum must be between 0 and 100`);
    }
    if (max < 0 || max > 100) {
        errors.push(`${gradeName}: Maximum must be between 0 and 100`);
    }

    return { valid: errors.length === 0, errors };
}

// Check for overlapping ranges
export function checkOverlappingRanges(ranges) {
    const errors = [];
    const sortedRanges = Object.entries(ranges).sort((a, b) => b[1].min - a[1].min);

    for (let i = 0; i < sortedRanges.length - 1; i++) {
        const [grade1, range1] = sortedRanges[i];
        const [grade2, range2] = sortedRanges[i + 1];

        // Check if ranges overlap
        if (range1.min <= range2.max && range1.min >= range2.min) {
            errors.push(`Grade ${grade1} (${range1.min}-${range1.max}%) overlaps with Grade ${grade2} (${range2.min}-${range2.max}%)`);
        }
        if (range1.max <= range2.max && range1.max >= range2.min) {
            errors.push(`Grade ${grade1} (${range1.min}-${range1.max}%) overlaps with Grade ${grade2} (${range2.min}-${range2.max}%)`);
        }
    }

    return { valid: errors.length === 0, errors };
}

// Validate all grade ranges
export function validateAllGradeRanges(gradeThresholds) {
    const allErrors = [];

    // Validate each grade range individually
    for (const [grade, range] of Object.entries(gradeThresholds)) {
        const validation = validateGradeRange(range.min, range.max, `Grade ${grade}`);
        if (!validation.valid) {
            allErrors.push(...validation.errors);
        }
    }

    // If individual validations pass, check for overlaps
    if (allErrors.length === 0) {
        const overlapValidation = checkOverlappingRanges(gradeThresholds);
        if (!overlapValidation.valid) {
            allErrors.push(...overlapValidation.errors);
        }
    }

    return { valid: allErrors.length === 0, errors: allErrors };
}

// Real-time validation for input fields
export function setupRealTimeValidation(gradeThresholds, onValidationChange) {
    // Add event listeners to all range inputs
    for (let grade = 1; grade <= 5; grade++) {
        const minInput = document.getElementById(`grade${grade}-min`);
        const maxInput = document.getElementById(`grade${grade}-max`);

        if (minInput && maxInput) {
            minInput.addEventListener('input', () => {
                gradeThresholds[grade].min = parseInt(minInput.value) || 0;
                const validation = validateAllGradeRanges(gradeThresholds);
                onValidationChange(validation);
            });

            maxInput.addEventListener('input', () => {
                gradeThresholds[grade].max = parseInt(maxInput.value) || 0;
                const validation = validateAllGradeRanges(gradeThresholds);
                onValidationChange(validation);
            });
        }
    }
}
