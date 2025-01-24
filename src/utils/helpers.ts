export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon"; 
  return "Good Evening";
}; 

export const generateTrackingId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 5;
  let trackingId = "";
  for (let i = 0; i < length; i++) {
    trackingId += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return trackingId;
};

export const askForLocationPermission = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

