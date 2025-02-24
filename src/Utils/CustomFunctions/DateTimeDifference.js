
  export const dateTimeDifference = (creationTime) => {
    const creationDate = new Date(creationTime);
    const currentDate = new Date();
    
    // Get the total difference in milliseconds
    const diffMilliseconds = currentDate - creationDate;

    // Convert to a readable format using built-in methods
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    //const diffSeconds = Math.floor((diffMilliseconds % (1000 * 60)) / 1000);
    
    return `${diffDays}d ${diffHours}h ${diffMinutes}m`;//${diffSeconds}s
  };