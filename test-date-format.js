// Test date formatting function
const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid date";

        const options = { year: "numeric", month: "long", day: "numeric" };
        return date.toLocaleDateString(undefined, options);
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
    }
};

// Test various date scenarios
console.log("Testing date formatting:");
console.log("Current date:", formatDate(new Date()));
console.log("ISO string:", formatDate(new Date().toISOString()));
console.log("Null:", formatDate(null));
console.log("Undefined:", formatDate(undefined));
console.log("Empty string:", formatDate(""));
console.log("Invalid date string:", formatDate("invalid"));
console.log("Epoch (1970-01-01):", formatDate(new Date(0)));
console.log("Valid date string:", formatDate("2024-12-25T10:30:00Z"));
