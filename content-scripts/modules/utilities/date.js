//Check if date is valid (YYYY-MM-DD)
export const isDate = (date) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
};

//Reverse date format from DD-MM-YYYY to YYYY-MM-DD and vice-versa
export const reverseDate = (date) => {
    return date.split("-").reverse().join("-");
};
